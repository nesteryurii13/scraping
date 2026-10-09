import { readFile, writeFile } from 'node:fs/promises';
const geo = JSON.parse(await readFile(new URL('../assets/maps/north-america.geojson', import.meta.url), 'utf8'));
const stateGeo = JSON.parse(await readFile(new URL('../assets/maps/us-states.geojson', import.meta.url), 'utf8'));
const rad = Math.PI / 180;
const n = (Math.sin(29.5 * rad) + Math.sin(45.5 * rad)) / 2;
const c = Math.cos(29.5 * rad) ** 2 + 2 * n * Math.sin(29.5 * rad);
const rho0 = Math.sqrt(c - 2 * n * Math.sin(38 * rad)) / n;
function project([lon, lat]) {
  const rho = Math.sqrt(c - 2 * n * Math.sin(lat * rad)) / n;
  const angle = n * (lon + 98) * rad;
  return [rho * Math.sin(angle), rho0 - rho * Math.cos(angle)];
}
const polygons = geo.features.flatMap(f => {
  const parts = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  return parts.filter(p => {
    const center = p[0].reduce((a, v) => [a[0] + v[0] / p[0].length, a[1] + v[1] / p[0].length], [0, 0]);
    return f.properties.code === 'CAN' ? center[1] < 75 : center[0] > -130 && center[1] < 50;
  }).map(rings => ({ code: f.properties.code, rings: rings.map(r => r.map(project)) }));
});
const points = polygons.flatMap(p => p.rings.flat());
const bounds = [Math.min(...points.map(p => p[0])), Math.max(...points.map(p => p[0])), Math.min(...points.map(p => p[1])), Math.max(...points.map(p => p[1]))];
const scale = Math.min(520 / (bounds[1] - bounds[0]), 330 / (bounds[3] - bounds[2]));
const offsetX = (560 - (bounds[1] - bounds[0]) * scale) / 2;
const offsetY = (370 - (bounds[3] - bounds[2]) * scale) / 2;
function screen(p) { return [+(offsetX + (p[0] - bounds[0]) * scale).toFixed(1), +(offsetY + (bounds[3] - p[1]) * scale).toFixed(1)]; }
const paths = polygons.map(p => ({ code: p.code, d: p.rings.map(r => r.map((p, i) => `${i ? 'L' : 'M'}${screen(p).join(',')}`).join('') + 'Z').join('') }));
function ringsFor(feature) {
  return (feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates : [feature.geometry.coordinates]).flat();
}
function pathFor(rings, transform) {
  return rings.map(ring => ring.map((point, index) => `${index ? 'L' : 'M'}${transform(point).join(',')}`).join('') + 'Z').join('');
}
function insetTransform(rings, [left, top, width, height]) {
  // Use a local projection so Alaska's antimeridian islands stay together.
  const lat = rings.flat().reduce((sum, point, _, points) => sum + point[1] / points.length, 0);
  const local = ([lon, latitude]) => [(lon > 0 ? lon - 360 : lon) * Math.cos(lat * rad), latitude];
  const points = rings.flat().map(local);
  const minX = Math.min(...points.map(point => point[0]));
  const maxX = Math.max(...points.map(point => point[0]));
  const minY = Math.min(...points.map(point => point[1]));
  const maxY = Math.max(...points.map(point => point[1]));
  const scale = Math.min(width / (maxX - minX), height / (maxY - minY));
  const x = left + (width - (maxX - minX) * scale) / 2;
  const y = top + (height - (maxY - minY) * scale) / 2;
  return point => {
    const [lon, latitude] = local(point);
    return [+(x + (lon - minX) * scale).toFixed(1), +(y + (maxY - latitude) * scale).toFixed(1)];
  };
}
const states = stateGeo.features.map(feature => {
  const { name, code } = feature.properties;
  const rings = ringsFor(feature);
  const inset = code === 'AK' || code === 'HI';
  const transform = inset ? insetTransform(rings, code === 'AK' ? [24, 281, 94, 65] : [139, 330, 65, 24]) : point => screen(project(point));
  return { name, code, inset, d: pathFor(rings, transform) };
});
if (states.filter(state => state.code !== 'DC').length !== 50 || new Set(states.map(state => state.code)).size !== 51) {
  throw new Error('The delivery illustration requires all 50 US states and the District of Columbia.');
}
const cities = [
  ['Vancouver, BC', -123.12, 49.28], ['Calgary, AB', -114.07, 51.05], ['Toronto, ON', -79.38, 43.65], ['Montréal, QC', -73.57, 45.5],
  ['Seattle, WA', -122.33, 47.61], ['Los Angeles, CA', -118.24, 34.05], ['Austin, TX', -97.74, 30.27], ['New York, NY', -74.01, 40.71],
].map(([name, lon, lat]) => ({ name, point: screen(project([lon, lat])) }));
await writeFile(new URL('../src/lib/coverage-map.json', import.meta.url), JSON.stringify({ paths, states, cities }, null, 2) + '\n');
console.log('Built the USA and Canada delivery illustration with all 50 US states');
