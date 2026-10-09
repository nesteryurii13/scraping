import map from "@/lib/coverage-map.json";

export default function CoverageMap() {
  const destinations = [map.cities[0], map.cities[2], map.cities[6], map.cities[7]];
  return <svg className="coverage-map" viewBox="0 0 560 370" aria-label="United States with all 50 state boundaries, Alaska and Hawaii shown as insets not to scale, and Canada, with example rental destinations">
    <g className="map-land">{map.paths.map((path, index) => <path key={index} d={path.d} className={path.code === "CAN" ? "map-canada" : "map-usa"} />)}</g>
    <g className="map-states">{map.states.map((state, index) => <path key={state.code} d={state.d} data-state={state.code} className={state.inset ? "map-state map-state-inset" : "map-state"} fill={["#a9c56e", "#afc974", "#b6cd7f"][index % 3]} stroke="#edf6d1" strokeWidth={state.inset ? .8 : .9} strokeLinejoin="round" vectorEffect="non-scaling-stroke">
      <title>{state.name}</title>
    </path>)}</g>
    <text x="24" y="271" fill="#4f6335" fontSize="10" fontWeight="500" aria-hidden="true">Insets · not to scale</text>
    <g className="map-inset-labels" fill="#4f6335" fontSize="10" fontWeight="500" textAnchor="middle" aria-hidden="true"><text x="71" y="361">Alaska</text><text x="171" y="367">Hawaii</text></g>
    <g className="map-routes" aria-hidden="true">{destinations.slice(1).map((city) => {
      const [x, y] = destinations[0].point;
      const [endX, endY] = city.point;
      return <path key={city.name} d={`M${x},${y} Q${(x + endX) / 2},${Math.min(y, endY) - 45} ${endX},${endY}`} />;
    })}</g>
    {map.cities.map(({ name, point: [x, y] }) => <a key={name} href="#quote" className="map-destination" aria-label={`Ask about rental delivery in ${name}`}>
      <title>{`${name} — ask about delivery`}</title>
      <circle className="map-target" cx={x} cy={y} r="15" />
      <g transform={`translate(${x - 7}, ${y - 19})`} aria-hidden="true"><path d="M7 0a7 7 0 0 1 7 7c0 5-7 12-7 12S0 12 0 7a7 7 0 0 1 7-7Z" /><circle cx="7" cy="7" r="2.5" /></g>
    </a>)}
  </svg>;
}
