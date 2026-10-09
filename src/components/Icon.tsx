import type { SVGProps } from "react";

const paths = {
  laptop: "M4 4h16v12H4z M2 20h20l-2-4H4z",
  arrow: "M4 12h15 M13 6l6 6-6 6",
  check: "m5 12 4 4L19 6",
  calendar: "M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2 M7 3v4 M17 3v4 M3 10h18",
  classroom: "m2 8 10-5 10 5-10 5-10-5 M6 11v6c4 3 8 3 12 0v-6 M22 8v8",
  team: "M12 20H2v-2a5 5 0 0 1 10 0v2 M15 14a4 4 0 0 1 7 4v2 M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M20 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  globe: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c5 5 5 13 0 18-5-5-5-13 0-18",
  settings: "M4 7h16 M4 17h16 M8 4v6 M16 14v6",
  box: "m3 7 9-4 9 4-9 4-9-4 M3 7v10l9 4 9-4V7 M12 11v10 M7 5l9 4",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  truck: "M2 5h12v12H2z M14 9h4l4 4v4h-8 M7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M21 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M18 9v4h4",
  message: "M4 4h16v13H9l-5 4V4 M8 9h8 M8 12h5",
  headphones: "M4 14v-3a8 8 0 0 1 16 0v3 M4 12H2v7h4v-7H4 M20 12h2v7h-4v-7h2 M20 19v2h-7",
  play: "m9 5 10 7-10 7V5",
} as const;
export type IconName = keyof typeof paths;
export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
