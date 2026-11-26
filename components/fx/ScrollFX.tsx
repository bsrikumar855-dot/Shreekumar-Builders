"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/utils/motion";
import { getLenis, setLenis } from "@/lib/utils/smooth-scroll";

/**
 * ScrollFX — the single owner of smooth scrolling and every scroll effect.
 *
 * Pages stay server-rendered and opt in with data attributes:
 *
 *   data-parallax="0.3"     vertical parallax. + = foreground (moves faster
 *                           than the page), − = background (slower).
 *                           Value is a fraction of the viewport height.
 *   data-parallax-x="0.4"   horizontal drift, fraction of viewport width.
 *   data-spin="120"         rotates by N degrees across the scroll pass.
 *   data-rotate="-8"        starts at N degrees, settles to 0 as it arrives.
 *   data-scale="0.85"       starts at N scale, settles to 1.
 *   data-mouse="0.03"       pointer parallax (fine pointers only).
 *   data-skew               skews with scroll velocity (marquees).
 *   data-progress           sets --p (0..1) on the element across its pass.
 *   data-reveal[="left|right|scale|clip|wipe"]  enters when scrolled into view.
 *   data-split              headline words slide up from a mask.
 *   data-delay="120"        ms delay for reveal/split.
 *
 * Only transforms are animated (compositor-only), ScrollTriggers are scrubbed
 * by Lenis' own smoothed scroll, and amplitudes are halved on small screens.
 * With prefers-reduced-motion nothing here runs and the page is static.
 */

const num = (v: string | null | undefined, fallback = 0) => {
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) ? n : fallback;
};

/** Wraps every word of an element's text nodes in a masked span. */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = "1";
  const label = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (label) el.setAttribute("aria-label", label);

  let index = 0;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          const outer = document.createElement("span");
          outer.className = "sw";
          outer.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.textContent = part;
          inner.style.setProperty("--i", String(index++));
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== "BR") {
        walk(child);
      }
    });
  };
  walk(el);
}

export default function ScrollFX() {
  const pathname = usePathname();

  /* ---------- Lenis: created once, owned for the life of the app ---------- */
  useEffect(() => {
    if (!document.documentElement.classList.contains("fx")) return;
    ensureGsap();

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  /* ---------- Effects: rebuilt for every route ---------- */
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("fx")) return;
    ensureGsap();

    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    // ---- Reveals (IntersectionObserver + CSS transitions) ----
    // clip-path'd elements report zero area to IntersectionObserver, so
    // "clip" / "wipe" reveals are observed through their parent instead.
    const targets = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          targets.get(entry.target)?.forEach((el) => el.classList.add("is-in"));
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-split]").forEach(splitWords);
    document.querySelectorAll<HTMLElement>("[data-reveal], [data-split]").forEach((el) => {
      const delay = num(el.dataset.delay);
      if (delay) el.style.setProperty("--d", `${delay}ms`);
      const clipped = el.dataset.reveal === "clip" || el.dataset.reveal === "wipe";
      const watch = clipped ? (el.parentElement ?? el) : el;
      targets.set(watch, [...(targets.get(watch) ?? []), el]);
      io.observe(watch);
    });

    // ---- Scrubbed GSAP effects ----
    const mm = gsap.matchMedia();
    mm.add(
      { small: "(max-width: 767px)", large: "(min-width: 768px)" },
      (ctx) => {
        const amp = ctx.conditions?.small ? 0.5 : 1;
        const cleanups: Array<() => void> = [];
        const vh = () => window.innerHeight;
        const vw = () => window.innerWidth;
        const scrubTo = (el: Element) =>
          (el.closest("[data-parallax-scope]") as Element | null) ?? el.parentElement ?? el;

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = num(el.dataset.parallax) * amp;
          gsap.fromTo(
            el,
            { y: () => speed * vh() * 0.5 },
            {
              y: () => -speed * vh() * 0.5,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: scrubTo(el),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax-x]").forEach((el) => {
          const speed = num(el.dataset.parallaxX) * amp;
          gsap.fromTo(
            el,
            { x: () => -speed * vw() * 0.5 },
            {
              x: () => speed * vw() * 0.5,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: scrubTo(el),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-spin]").forEach((el) => {
          const deg = num(el.dataset.spin, 90);
          gsap.fromTo(
            el,
            { rotation: -deg / 2 },
            {
              rotation: deg / 2,
              ease: "none",
              scrollTrigger: {
                trigger: scrubTo(el),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-rotate]").forEach((el) => {
          gsap.fromTo(
            el,
            { rotation: num(el.dataset.rotate) * amp, transformOrigin: "50% 100%" },
            {
              rotation: 0,
              ease: "none",
              scrollTrigger: {
                trigger: scrubTo(el),
                start: "top bottom",
                end: "top 30%",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-scale]").forEach((el) => {
          gsap.fromTo(
            el,
            { scale: num(el.dataset.scale, 0.85) },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: scrubTo(el),
                start: "top bottom",
                end: "center 55%",
                scrub: true,
              },
            },
          );
        });

        // Marquee bands react to scrolling: they skew with speed, run faster
        // the harder you scroll, and reverse when you scroll back up.
        gsap.utils.toArray<HTMLElement>("[data-skew]").forEach((el) => {
          const setSkew = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3.out" });
          const track = el.querySelector<HTMLElement>(".marquee-track");
          const anim = track?.getAnimations()[0];
          if (anim) {
            // Start deep into the loop so reverse playback never hits time 0
            const dur = Number(anim.effect?.getTiming().duration ?? 38000);
            anim.currentTime = dur * 50;
          }
          let dir = 1;
          let idle = 0;
          const setRate = (r: number) => {
            if (anim) gsap.to(anim, { playbackRate: r, duration: 0.5, ease: "power3.out", overwrite: true });
          };
          const st = ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              const v = self.getVelocity();
              setSkew(gsap.utils.clamp(-7, 7, v / -260));
              if (Math.abs(v) < 30) return;
              dir = v > 0 ? 1 : -1;
              setRate(dir * (1 + Math.min(Math.abs(v) / 350, 7)));
              window.clearTimeout(idle);
              idle = window.setTimeout(() => {
                setRate(dir);
                setSkew(0);
              }, 160);
            },
            onLeave: () => setSkew(0),
            onLeaveBack: () => setSkew(0),
          });
          cleanups.push(() => {
            window.clearTimeout(idle);
            st.kill();
          });
        });

        // Progress variable for CSS-driven effects
        gsap.utils.toArray<HTMLElement>("[data-progress]").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            end: "bottom 35%",
            onUpdate: (self) => el.style.setProperty("--p", self.progress.toFixed(4)),
          });
        });

        // Pinned process stepper: scroll drives it, and the segments drive scroll
        gsap.utils.toArray<HTMLElement>(".steps").forEach((box) => {
          const items = Array.from(box.querySelectorAll<HTMLElement>(".steps-item"));
          const dots = Array.from(box.querySelectorAll<HTMLElement>("[data-step-go]"));
          const setActive = (idx: number) => {
            items.forEach((it, i) => it.setAttribute("data-active", String(i === idx)));
            dots.forEach((d, i) => {
              d.dataset.on = String(i <= idx);
              if (i === idx) d.setAttribute("aria-current", "step");
              else d.removeAttribute("aria-current");
            });
          };
          setActive(0);
          ScrollTrigger.create({
            trigger: box,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              box.style.setProperty("--p", self.progress.toFixed(4));
              setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length)));
            },
          });
          dots.forEach((d, i) => {
            const go = () => {
              const range = box.offsetHeight - window.innerHeight;
              const y = box.getBoundingClientRect().top + window.scrollY + range * ((i + 0.5) / items.length);
              const l = getLenis();
              if (l) l.scrollTo(y, { duration: 1.4 });
              else window.scrollTo({ top: y, behavior: "smooth" });
            };
            d.addEventListener("click", go);
            cleanups.push(() => d.removeEventListener("click", go));
          });
        });

        // Pointer parallax (fine pointers only)
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        let onMove: ((e: PointerEvent) => void) | null = null;
        if (fine) {
          const layers = gsap.utils.toArray<HTMLElement>("[data-mouse]").map((el) => ({
            k: num(el.dataset.mouse, 0.02),
            x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
          }));
          if (layers.length) {
            onMove = (e: PointerEvent) => {
              const dx = e.clientX / vw() - 0.5;
              const dy = e.clientY / vh() - 0.5;
              layers.forEach((l) => {
                l.x(dx * l.k * vw());
                l.y(dy * l.k * vh());
              });
            };
            window.addEventListener("pointermove", onMove, { passive: true });
          }
        }

        return () => {
          if (onMove) window.removeEventListener("pointermove", onMove);
          cleanups.forEach((fn) => fn());
        };
      },
    );

    // Positions depend on final font metrics
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(refresh).catch(() => {});
    const settle = window.setTimeout(refresh, 400);

    root.setAttribute("data-fx-ready", "1");

    return () => {
      window.clearTimeout(settle);
      io.disconnect();
      mm.revert();
    };
  }, [pathname]);

  return null;
}
