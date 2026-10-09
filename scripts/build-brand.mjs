import { readFile, writeFile, mkdir, copyFile, access } from "node:fs/promises";
import sharp from "sharp";

const directory = new URL("../assets/brand/", import.meta.url);
await mkdir(directory, { recursive: true });
const brand = JSON.parse(await readFile(new URL("logo-v2.json", directory), "utf8"));
const original = new URL("../assets/laptoprent-icon.svg", import.meta.url);
const archive = new URL("laptoprent-icon-v1.svg", directory);
try { await access(archive); } catch { await copyFile(original, archive); }

const symbol = `<rect width="64" height="64" rx="17" fill="${brand.background}"/><path d="${brand.lPath}" fill="${brand.lime}"/><path d="${brand.rPath}" fill="${brand.ivory}" fill-rule="evenodd"/>`;
const mark = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="${brand.viewBox}">${symbol}</svg>\n`;
await writeFile(original, mark);
await writeFile(new URL("laptoprent-mark.svg", directory), mark);

for (const [name, color] of [["light", brand.background], ["dark", brand.ivory]]) {
  const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="328" height="80" viewBox="0 0 328 80" role="img" aria-label="LaptopRent"><g transform="translate(0 8)">${symbol}</g><text x="80" y="53" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="44" letter-spacing="-1.5"><tspan font-weight="700">Laptop</tspan><tspan font-weight="400">Rent</tspan></text></svg>\n`;
  await writeFile(new URL(`laptoprent-logo-${name}.svg`, directory), logo);
  await writeFile(new URL(`laptoprent-logo-${name}.png`, directory), await sharp(Buffer.from(logo)).resize(1312, 320).png().toBuffer());
}
await writeFile(new URL("laptoprent-mark.png", directory), await sharp(Buffer.from(mark)).resize(512, 512).png().toBuffer());
console.log("Built the custom LaptopRent logo and transparent exports");
