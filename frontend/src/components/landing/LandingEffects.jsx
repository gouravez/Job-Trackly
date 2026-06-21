import { useEffect, useRef } from "react";

// ─── useReveal hook ───────────────────────────────────────────────────────────
// Observes an element and flips `data-visible` to "true" once it enters view.
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getAttribute("data-visible") === "true") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "true");
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

// ─── Animated element ─────────────────────────────────────────────────────────
// variant: "up" | "left" | "right" | "scale" | "rotateLeft" | "rotateRight"
// delay: ms number
export function Reveal({ children, variant = "up", delay = 0, className = "", style = {}, as: Tag = "div" }) {
  const ref = useReveal(0.12);

  const base = {
    up:          { transform: "translateY(30px)" },
    left:        { transform: "translateX(-36px)" },
    right:       { transform: "translateX(36px)" },
    scale:       { transform: "scale(0.93) translateY(18px)" },
    rotateLeft:  { transform: "rotate(-7deg) scale(0.94) translateY(24px)" },
    rotateRight: { transform: "rotate(7deg) scale(0.94) translateY(24px)" },
  }[variant];

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        ...base,
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
      data-reveal
    >
      {children}
    </Tag>
  );
}

// Inject a tiny global stylesheet that flips opacity/transform when data-visible fires.
// Using a <style> tag ensures it beats Tailwind's purge (no Tailwind class needed).
export const GLOBAL_CSS = `
[data-reveal][data-visible="true"] {
  opacity: 1 !important;
  transform: none !important;
}
[data-stat-pop][data-visible="true"] {
  animation: statPop 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes statPop {
  0%   { opacity:0; transform:scale(0.75); }
  65%  { transform:scale(1.08); }
  100% { opacity:1; transform:scale(1); }
}
.feat-card {
  border-radius: 1rem;
  padding: 1.5rem;
  transition: box-shadow 0.22s ease, transform 0.22s ease;
  will-change: transform;
}
.feat-card:hover {
  box-shadow: 0 10px 30px rgba(0,0,0,0.09);
  transform: translateY(-5px) !important;
}

/* ── Scroll progress bar ──────────────────────────────────────────────────── */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #2f54c8;
  transform-origin: left;
  transform: scaleX(0);
  z-index: 10001;
  will-change: transform;
}

/* ── Custom circular cursor ───────────────────────────────────────────────── */
html.custom-cursor-active,
html.custom-cursor-active * {
  cursor: none !important;
}
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  margin-top: -3px;
  border-radius: 50%;
  background: #111827;
  pointer-events: none;
  z-index: 10000;
  transition: opacity 0.2s ease;
}
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  margin-left: -16px;
  margin-top: -16px;
  border-radius: 50%;
  border: 1.5px solid rgba(17,24,39,0.45);
  pointer-events: none;
  z-index: 9999;
  transition: width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1),
              margin 0.25s cubic-bezier(0.16,1,0.3,1), background-color 0.2s ease,
              border-color 0.2s ease, opacity 0.2s ease;
}
.cursor-ring[data-state="hover"] {
  width: 56px;
  height: 56px;
  margin-left: -28px;
  margin-top: -28px;
  background: rgba(79,70,229,0.08);
  border-color: rgba(79,70,229,0.55);
}
.cursor-ring[data-state="down"] {
  width: 22px;
  height: 22px;
  margin-left: -11px;
  margin-top: -11px;
  background: rgba(79,70,229,0.18);
  border-color: rgba(79,70,229,0.75);
}
@media (pointer: coarse) {
  .cursor-dot, .cursor-ring { display: none !important; }
}

/* ── Click ripple ─────────────────────────────────────────────────────────── */
.click-ripple {
  position: fixed;
  width: 36px;
  height: 36px;
  margin-left: -18px;
  margin-top: -18px;
  border-radius: 50%;
  border: 2px solid rgba(79,70,229,0.55);
  pointer-events: none;
  z-index: 9998;
  transform: scale(0.2);
  opacity: 0.9;
  animation: rippleExpand 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes rippleExpand {
  to { transform: scale(1.7); opacity: 0; }
}

/* ── Smooth-scroll wrapper ────────────────────────────────────────────────── */
/* The real content sits inside #smooth-content, pinned to the viewport and   */
/* translated by JS. #smooth-spacer is an invisible same-height div so the    */
/* browser still gets a native, full-length scrollbar to drag.                */
#smooth-spacer {
  visibility: hidden;
  pointer-events: none;
}
.smooth-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
}

/* ── Pricing cards ─────────────────────────────────────────────────────────── */
.price-card {
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease;
}
.price-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 45px rgba(17,24,39,0.10);
}

/* ── Sidewise feature swap ────────────────────────────────────────────────── */
.feat-swap-panel {
  position: relative;
  overflow: hidden;
}
.feat-swap-slide-right {
  animation: featSwapInRight 0.45s cubic-bezier(0.16,1,0.3,1) both;
}
.feat-swap-slide-left {
  animation: featSwapInLeft 0.45s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes featSwapInRight {
  from { opacity: 0; transform: translateX(36px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes featSwapInLeft {
  from { opacity: 0; transform: translateX(-36px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Feature carousel ─────────────────────────────────────────────────────── */
.feat-carousel-in-right {
  animation: featCarouselRight 0.38s cubic-bezier(0.16,1,0.3,1) both;
}
.feat-carousel-in-left {
  animation: featCarouselLeft 0.38s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes featCarouselRight {
  from { opacity: 0; transform: translateX(48px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes featCarouselLeft {
  from { opacity: 0; transform: translateX(-48px); }
  to   { opacity: 1; transform: translateX(0); }
}
.feat-feature-card {
  cursor: pointer;
  will-change: transform, opacity;
}
.feat-tab {
  position: relative;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.feat-tab[data-active="true"] {
  background-color: rgba(99,102,241,0.06);
}
.feat-tab-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 2px;
  background: #2f54c8;
  transform: scaleY(0);
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
  transform-origin: center;
}
.feat-tab[data-active="true"] .feat-tab-bar {
  transform: scaleY(1);
}
.feat-progress-track {
  height: 2px;
  background: rgba(17,24,39,0.06);
  border-radius: 1px;
  overflow: hidden;
}
.feat-progress-fill {
  height: 100%;
  background: #2f54c8;
  transform-origin: left;
}

@media (prefers-reduced-motion: reduce) {
  .feat-swap-slide-right, .feat-swap-slide-left { animation: none !important; }
  [data-reveal], [data-stat-pop] {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
  .cursor-dot, .cursor-ring { display: none !important; }
  html.custom-cursor-active, html.custom-cursor-active * { cursor: auto !important; }
  .smooth-content { position: static !important; transform: none !important; }
  #smooth-spacer { display: none !important; }
}
`;

// ─── Click feedback: ripple + a tiny synthesized "tick" sound ─────────────────
// No audio asset needed — a short oscillator blip avoids licensing an SFX file
// and keeps the bundle size untouched.
let audioCtx = null;
function getAudioCtx() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

function playClickSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;

  // Master output gain — keeps overall volume gentle
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.18, now);
  master.connect(ctx.destination);

  // ── Layer 1: punchy click transient ────────────────────────────────────
  // A very short burst of noise shaped into a tight "tick"
  const bufSize  = ctx.sampleRate * 0.04; // 40 ms of noise
  const buffer   = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data     = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const noise     = ctx.createBufferSource();
  noise.buffer    = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.55, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

  // High-pass the noise so it's a crisp "snap" not a thud
  const hp       = ctx.createBiquadFilter();
  hp.type        = "highpass";
  hp.frequency.value = 3200;
  hp.Q.value     = 0.7;

  noise.connect(hp);
  hp.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(now);
  noise.stop(now + 0.04);

  // ── Layer 2: tonal body — a quick pitched "tock" ──────────────────────
  // Triangle wave gives warmth without being too sharp
  const osc     = ctx.createOscillator();
  osc.type      = "triangle";
  osc.frequency.setValueAtTime(1100, now);
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.055);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.0, now);
  oscGain.gain.linearRampToValueAtTime(0.38, now + 0.004); // tiny attack
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

  osc.connect(oscGain);
  oscGain.connect(master);
  osc.start(now);
  osc.stop(now + 0.08);

  // ── Layer 3: sub-harmonic thump for a sense of physicality ───────────
  const sub     = ctx.createOscillator();
  sub.type      = "sine";
  sub.frequency.setValueAtTime(180, now);
  sub.frequency.exponentialRampToValueAtTime(60, now + 0.045);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.28, now);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  sub.connect(subGain);
  subGain.connect(master);
  sub.start(now);
  sub.stop(now + 0.06);
}

function spawnRipple(x, y) {
  const el = document.createElement("div");
  el.className = "click-ripple";
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

// ─── Custom circular cursor — grows on links/buttons, shrinks on click ────────
// Disabled automatically on touch devices and when reduced motion is requested.
export function CustomCursor() {
  const enabledRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabledRef.current) return;
    document.documentElement.classList.add("custom-cursor-active");

    const pos  = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let hovering = false;
    let down     = false;

    const syncState = () => {
      if (ringRef.current) ringRef.current.dataset.state = down ? "down" : hovering ? "hover" : "default";
    };

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    };
    const onOver = (e) => {
      hovering = Boolean(e.target.closest && e.target.closest("a, button, [data-cursor-hover]"));
      syncState();
    };
    const onDown = (e) => {
      down = true;
      syncState();
      spawnRipple(e.clientX, e.clientY);
      playClickSound();
    };
    const onUp = () => { down = false; syncState(); };
    const onLeaveWindow = () => {
      if (dotRef.current)  dotRef.current.style.opacity  = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnterWindow = () => {
      if (dotRef.current)  dotRef.current.style.opacity  = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    let raf;
    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.2;
      ring.y += (pos.y - ring.y) * 0.2;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabledRef.current) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" data-state="default" />
    </>
  );
}

// ─── Thin progress bar across the top that fills in as the page is scrolled ───
export function ScrollProgressBar() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const doc      = document.documentElement;
        const scrolled = doc.scrollTop || document.body.scrollTop;
        const max      = doc.scrollHeight - doc.clientHeight;
        const progress = max > 0 ? scrolled / max : 0;
        if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

// ─── Parallax wrapper — shifts its element vertically as the page scrolls ─────
export function Parallax({ speed = 0.15, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return <div ref={ref} className={className} />;
}

// ─── SmoothScroll — gives the page "weight" so it decelerates after a flick ───
// Implementation: the real content is rendered inside a fixed-position layer
// (`.smooth-content`). A same-height invisible spacer keeps the browser's
// native scrollbar at full document length, so scrolling, keyboard nav, and
// anchor links (#features etc.) all keep working untouched. On every animation
// frame we ease the layer's translateY toward the real scroll position with a
// lerp, which is what produces the "slows down" / momentum feel instead of an
// abrupt 1:1 follow. Disabled entirely for touch input and reduced-motion users,
// where native scrolling already feels right (and is more predictable).
export function SmoothScroll({ children, intensity = 0.085 }) {
  const contentRef = useRef(null);
  const spacerRef  = useRef(null);
  const currentRef = useRef(0);
  const enabledRef = useRef(
    typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(pointer: fine)").matches
  );

  useEffect(() => {
    if (!enabledRef.current) return;
    const content = contentRef.current;
    const spacer  = spacerRef.current;
    if (!content || !spacer) return;

    currentRef.current = window.scrollY;

    const syncHeight = () => {
      spacer.style.height = `${content.offsetHeight}px`;
    };
    syncHeight();

    // Content height changes as reveal animations / images / fonts settle.
    const ro = new ResizeObserver(syncHeight);
    ro.observe(content);
    window.addEventListener("resize", syncHeight);
    window.addEventListener("load", syncHeight);

    let raf;
    const tick = () => {
      const target = window.scrollY;
      currentRef.current += (target - currentRef.current) * intensity;
      // Snap once close enough so it doesn't drift forever at sub-pixel deltas.
      if (Math.abs(target - currentRef.current) < 0.05) currentRef.current = target;
      content.style.transform = `translate3d(0, ${-currentRef.current}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Lets things outside this component (e.g. the "back to top" button) jump
    // the eased layer straight to a position instead of waiting for the lerp
    // to catch up — used for an instant (non-animated) scroll-to-top.
    window.__landingSnapScroll = (top = 0) => {
      window.scrollTo({ top });
      currentRef.current = top;
      content.style.transform = `translate3d(0, ${-top}px, 0)`;
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", syncHeight);
      window.removeEventListener("load", syncHeight);
      delete window.__landingSnapScroll;
    };
  }, [intensity]);

  if (!enabledRef.current) {
    return <div>{children}</div>;
  }

  return (
    <>
      <div ref={contentRef} className="smooth-content">
        {children}
      </div>
      <div ref={spacerRef} id="smooth-spacer" />
    </>
  );
}