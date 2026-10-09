import brand from "../../assets/brand/logo-v2.json";

export default function BrandMark() {
  return <svg viewBox={brand.viewBox} fill="none" aria-hidden="true">
    <rect width="64" height="64" rx="17" fill={brand.background} />
    <path d={brand.lPath} fill={brand.lime} />
    <path d={brand.rPath} fill={brand.ivory} fillRule="evenodd" />
  </svg>;
}
