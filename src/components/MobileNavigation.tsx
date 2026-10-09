"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/Icon";

export default function MobileNavigation({ links }: {
  links: { href: string; label: string }[];
}) {
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target) && menu.current) {
        menu.current.open = false;
      }
    }
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  return <details ref={menu} className="mobile-menu">
    <summary aria-label="Navigation menu"><Icon name="menu" /></summary>
    <nav aria-label="Mobile navigation">
      {links.map((link) => <a key={link.href} href={link.href} onClick={() => {
        if (menu.current) menu.current.open = false;
      }}>{link.label}<Icon name="arrow" /></a>)}
    </nav>
  </details>;
}
