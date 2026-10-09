"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

function subscribeMotion(callback: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", callback);
  return () => preference.removeEventListener("change", callback);
}

function getMotionState() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  return "animate" in Element.prototype && "IntersectionObserver" in window ? "enabled" : "unavailable";
}

/** Progressively enhances visible, server-rendered content with motion. */
export default function MotionEffects() {
  const motionState = useSyncExternalStore(subscribeMotion, getMotionState, () => "loading");
  const replay = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (motionState !== "enabled") return;
    const motion = enhanceMotion();
    replay.current = motion.replay;
    return () => {
      replay.current = null;
      motion.dispose();
    };
  }, [motionState]);

  return <>
    <div className="reading-progress" aria-hidden="true" />
    <div className="motion-controls">
      <button type="button" className="motion-replay" disabled={motionState !== "enabled"} onClick={() => replay.current?.()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1.8 7M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Replay animations
      </button>
      <span className="motion-hint" role="status">{motionState === "reduced" ? "Motion reduced by your device settings" : motionState === "unavailable" ? "Animation preview unavailable in this browser" : "Scroll to see more"}</span>
    </div>
  </>;
}

function enhanceMotion() {
  const animations = new Map<HTMLElement, Animation>();
  let disposed = false;
  let heroPlayed = false;

  function play(target: HTMLElement, frames: Keyframe[], duration: number, delay = 0) {
    animations.get(target)?.cancel();
    const animation = target.animate(frames, { duration, delay, easing: ease, fill: "backwards" });
    animations.set(target, animation);
    function forget() {
      if (animations.get(target) === animation) animations.delete(target);
    }
    animation.finished.then(forget, forget);
  }

  function playHero() {
    heroPlayed = true;
    document.querySelectorAll<HTMLElement>("[data-intro]").forEach((target) => {
      // Never move a form while someone is typing into it.
      if (target.contains(document.activeElement)) return;
      const kind = target.dataset.intro;
      const delay = Number(target.dataset.motionDelay) || 0;
      animations.get(target)?.cancel();
      const transform = getComputedStyle(target).transform;
      if (kind === "image") {
        play(target, [{ transform: "scale(1.24)" }, { transform }], 1800, delay);
      } else if (kind === "badge") {
        play(target, [
          { transform: "translateY(28px) rotate(-4deg)" },
          { transform: "translateY(-7px) rotate(1deg)", offset: 0.65 },
          { transform: "translateY(0) rotate(0)" },
        ], 1700, delay);
      } else {
        play(target, [
          { transform: kind === "headline" ? "translateY(110%)" : `translateY(38px) ${transform === "none" ? "" : transform}` },
          { transform: transform === "none" ? "translateY(0)" : transform },
        ], kind === "headline" ? 1300 : 1400, delay);
      }
    });
  }

  // Start the photo entrance after its pixels are ready, so it can actually be seen.
  const heroImage = document.querySelector<HTMLImageElement>(".hero-photo img");
  Promise.resolve(heroImage?.decode().catch(() => {})).then(() => {
    if (!disposed && !heroPlayed) playHero();
  });

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target as HTMLElement;
      observer.unobserve(target);
      const photo = target.dataset.motion === "photo";
      play(target, [
        { opacity: 0, transform: photo ? "translate3d(0, 64px, 0) scale(0.94)" : "translate3d(0, 54px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ], photo ? 1300 : 1100, Math.min(Number(target.dataset.motionDelay) || 0, 450));
    }
  }, { threshold: 0.08 });
  document.querySelectorAll<HTMLElement>("[data-motion]").forEach((target) => observer.observe(target));

  function finishForFocus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    // Nested reveals must also finish when their content receives keyboard focus.
    for (let target: Element | null = event.target; target; target = target.parentElement) {
      animations.get(target as HTMLElement)?.finish();
    }
  }
  document.addEventListener("focusin", finishForFocus);

  const scenes = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty("--reading-progress", String(distance > 0 ? window.scrollY / distance : 0));
    if (!finePointer.matches) return;
    // Read all positions first, then write transforms, avoiding forced layout.
    const positions = scenes.map((scene) => ({ scene, box: scene.getBoundingClientRect() }));
    for (const { scene, box } of positions) {
      if (box.bottom < 0 || box.top > window.innerHeight) continue;
      const relative = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const amplitude = Math.min(10, box.height * 0.035);
      scene.style.setProperty("--photo-offset", `${Math.max(-amplitude, Math.min(amplitude, relative * -16)).toFixed(2)}px`);
    }
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", scheduleScroll, { passive: true });
  scheduleScroll();

  const pointerCleanups: (() => void)[] = [];
  if (finePointer.matches) {
    document.querySelectorAll<HTMLElement>("[data-tilt], .button:has(.button-arrow)").forEach((target) => {
      const card = target.hasAttribute("data-tilt");
      let box: DOMRect | undefined;
      let frame = 0;
      let x = 0;
      let y = 0;
      function enter() { box = target.getBoundingClientRect(); }
      function move(event: PointerEvent) {
        if (!box || event.pointerType === "touch") return;
        x = Math.max(-0.5, Math.min(0.5, (event.clientX - box.left) / box.width - 0.5));
        y = Math.max(-0.5, Math.min(0.5, (event.clientY - box.top) / box.height - 0.5));
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          target.style.setProperty(card ? "--tilt-x" : "--arrow-x", `${card ? -y * 5 : x * 10}${card ? "deg" : "px"}`);
          target.style.setProperty(card ? "--tilt-y" : "--arrow-y", `${card ? x * 6 : y * 8}${card ? "deg" : "px"}`);
        });
      }
      function leave() {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        target.style.removeProperty(card ? "--tilt-x" : "--arrow-x");
        target.style.removeProperty(card ? "--tilt-y" : "--arrow-y");
      }
      target.addEventListener("pointerenter", enter);
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerleave", leave);
      pointerCleanups.push(() => {
        target.removeEventListener("pointerenter", enter);
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerleave", leave);
        leave();
      });
    });
  }

  return { replay: () => {
    playHero();
    document.querySelectorAll<HTMLElement>("[data-motion]").forEach((target) => observer.observe(target));
  }, dispose: () => {
    disposed = true;
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    document.removeEventListener("focusin", finishForFocus);
    window.removeEventListener("scroll", scheduleScroll);
    window.removeEventListener("resize", scheduleScroll);
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    scenes.forEach((scene) => scene.style.removeProperty("--photo-offset"));
    document.documentElement.style.removeProperty("--reading-progress");
    pointerCleanups.forEach((cleanup) => cleanup());
  } };
}
