import { readFile, writeFile, mkdir, stat, readdir, unlink, rmdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const photos = JSON.parse(await readFile(new URL("../assets/photos.json", import.meta.url), "utf8"));
const manifest = {};
for (const photo of photos) {
  const original = await readFile(new URL(`../assets/image-originals/${photo.original ?? `${photo.id}.jpg`}`, import.meta.url));
  const hash = createHash("sha256").update(original).update(JSON.stringify(photo)).update("pipeline-v1").digest("hex").slice(0, 10);
  const directory = new URL(`../public/images/${photo.id}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  const variants = [];
  const currentFiles = new Set();
  for (const width of photo.widths) {
    const height = Math.round(width / photo.ratio);
    const variant = { width, height };
    for (const format of ["avif", "webp", "jpeg"]) {
      const extension = format === "jpeg" ? "jpg" : format;
      const filename = `${hash}-${width}.${extension}`;
      currentFiles.add(filename);
      const target = new URL(filename, directory);
      let cached = false;
      try { cached = (await stat(target)).size <= photo.budget; } catch {}
      if (!cached) {
        let quality = format === "avif" ? 48 : 76;
        let buffer;
        do {
          const image = sharp(original).rotate();
          if (photo.crop) image.extract(photo.crop);
          buffer = await image.resize(width, height, { fit: "cover", position: "attention" }).toFormat(format, { quality, effort: format === "avif" ? 4 : undefined }).toBuffer();
          if (buffer.length <= photo.budget) break;
          quality -= 8;
        } while (quality >= 28);
        if (buffer.length > photo.budget) throw new Error(`${photo.id}/${filename} exceeds ${photo.budget} bytes`);
        await writeFile(target, buffer);
      }
      variant[format] = `/images/${photo.id}/${filename}`;
    }
    variants.push(variant);
  }
  for (const filename of await readdir(directory)) {
    if (/^[a-f0-9]{10}-\d+\.(avif|webp|jpg)$/.test(filename) && !currentFiles.has(filename)) {
      await unlink(new URL(filename, directory));
    }
  }
  manifest[photo.id] = { alt: photo.alt, ratio: photo.ratio, variants };
  console.log(`Optimized ${photo.id}`);
}
// Remove only obsolete folders made entirely of this pipeline's hashed files.
const imageRoot = new URL("../public/images/", import.meta.url);
const activeIds = new Set(photos.map((photo) => photo.id));
for (const entry of await readdir(imageRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || activeIds.has(entry.name)) continue;
  const directory = new URL(`${entry.name}/`, imageRoot);
  const files = await readdir(directory);
  if (files.every((file) => /^[a-f0-9]{10}-\d+\.(avif|webp|jpg)$/.test(file))) {
    for (const file of files) await unlink(new URL(file, directory));
    await rmdir(directory);
  }
}
await writeFile(new URL("../src/lib/photo-manifest.json", import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const credits = photos.map((photo) => `<li><a href="${escape(photo.source)}">${escape(photo.alt)}</a><br>Photo by ${escape(photo.photographer)} on Unsplash.</li>`).join("\n");
await writeFile(new URL("../public/photo-credits.html", import.meta.url), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Photo credits | LaptopRent</title><style>body{margin:0;background:#f8f9f1;color:#192019;font:16px/1.6 system-ui,sans-serif}main{max-width:760px;padding:40px 24px;margin:auto}h1{font-size:36px;line-height:1.1}li{margin-bottom:20px}a{color:#354d1f;text-underline-offset:3px}.back{display:inline-block;padding:10px 20px;border-radius:100px;background:#d5f56f;margin-top:20px}</style></head><body><main><h1>Photography & map credits</h1><p>Real photographs show example equipment and workspaces. Available rental models and configurations are confirmed with your quote.</p><ul>${credits}</ul><p>Photographs are used under the <a href="https://unsplash.com/license">Unsplash License</a>. Geographic outlines use public-domain <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth data</a>. Map markers illustrate example destinations; your quote confirms delivery availability.</p><a class="back" href="/">Back to LaptopRent</a></main></body></html>`);
await import("./build-coverage-map.mjs");

// The same vector brand mark supplies the browser tab and home-screen icons.
await import("./build-brand.mjs");
const icon = await readFile(new URL("../assets/laptoprent-icon.svg", import.meta.url));
const smallIcon = await sharp(icon).resize(48, 48).png().toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader[6] = 48;
icoHeader[7] = 48;
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(smallIcon.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([icoHeader, smallIcon]));
await writeFile(new URL("../src/app/apple-icon.png", import.meta.url), await sharp(icon).resize(180, 180).png().toBuffer());
