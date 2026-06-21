import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";

// ─── Shared scroll helper ──────────────────────────────────────────────────
// Smoothly animates to the top by driving the real scroll position with a
// requestAnimationFrame easing loop, which the SmoothScroll lerp layer then
// follows naturally — giving a consistent feel with the rest of the page.
function scrollToTop() {
  const start     = window.scrollY
  const startTime = performance.now()
  const duration  = Math.min(900, Math.max(400, start * 0.35)) // scale with distance

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  function step(now) {
    const elapsed  = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased    = easeOutExpo(progress)

    window.scrollTo(0, start * (1 - eased))

    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

// ─── ScrollDownHint ────────────────────────────────────────────────────────
// A pill button fixed to the bottom-left corner (mirrors BackToTop on the
// right). Visible whenever there's meaningfully more page below, hides once
// the user nears the bottom (and while BackToTop's "top" zone is active,
// since there's nothing useful to scroll to yet there either).
export function ScrollDownHint() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max < window.innerHeight * 0.5) {
        setVisible(false);
        return;
      }
      const nearBottom = window.scrollY > max - window.innerHeight * 0.15;
      setVisible(!nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
      aria-label="Scroll down"
      style={{
        position: "fixed",
        bottom: "28px",
        left: "28px",
        zIndex: 200,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.85)",
        pointerEvents: visible ? "auto" : "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 16px",
        borderRadius: "999px",
        border: "1px solid rgba(47,84,200,0.25)",
        background: hovered
          ? "#2f54c8"
          : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        boxShadow: hovered
          ? "0 8px 28px rgba(47,84,200,0.35)"
          : "0 4px 16px rgba(17,24,39,0.10)",
        color: hovered ? "#fff" : "#2f54c8",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: [
          "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
          "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          "background 0.25s ease",
          "box-shadow 0.25s ease",
          "color 0.25s ease",
        ].join(", "),
      }}
    >
      <ChevronDown
        size={15}
        strokeWidth={2.5}
        style={{ animation: visible ? "scrollBounce 1.6s ease-in-out infinite" : "none" }}
      />
      <span>Scroll</span>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(3px); }
        }
      `}</style>
    </button>
  );
}

// ─── BackToTop ────────────────────────────────────────────────────────────
// A pill button fixed to the bottom-right corner.
// Appears after the user scrolls past one viewport height, hides near the top.
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 200,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.85)",
        transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: visible ? "auto" : "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 16px",
        borderRadius: "999px",
        border: "1px solid rgba(47,84,200,0.25)",
        background: hovered
          ? "#2f54c8"
          : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        boxShadow: hovered
          ? "0 8px 28px rgba(47,84,200,0.35)"
          : "0 4px 16px rgba(17,24,39,0.10)",
        color: hovered ? "#fff" : "#2f54c8",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: [
          "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
          "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          "background 0.25s ease",
          "box-shadow 0.25s ease",
          "color 0.25s ease",
        ].join(", "),
      }}
    >
      <ArrowUp size={15} strokeWidth={2.5} />
      <span>Top</span>
    </button>
  );
}