import photos from "@/lib/photo-manifest.json";

export type PhotoId = keyof typeof photos;
export default function Photo({ id, sizes, className = "", eager = false, intro = false }: {
  id: PhotoId; sizes: string; className?: string; eager?: boolean; intro?: boolean;
}) {
  const photo = photos[id];
  const fallback = photo.variants[1];
  const srcSet = (format: "avif" | "webp" | "jpeg") => photo.variants.map((variant) => `${variant[format]} ${variant.width}w`).join(", ");
  return <picture className={`photo ${className}`} style={{ aspectRatio: photo.ratio }}>
    <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
    {/* Build-generated variants provide responsive delivery with a static export. */}
    <img data-intro={intro ? "image" : undefined} src={fallback.jpeg} srcSet={srcSet("jpeg")} sizes={sizes} width={fallback.width} height={fallback.height} alt={photo.alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" />
  </picture>;
}
