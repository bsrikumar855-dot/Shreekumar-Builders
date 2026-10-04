"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGsap } from "@/lib/utils/motion";
import { usePrefersReducedMotion } from "@/lib/utils/hooks";
import { navItems } from "@/lib/data/site";
import MenuOverlay from "./MenuOverlay";
import { scrollToId } from "@/lib/utils/smooth-scroll";

/**
 * Navbar
 * Transparent over the hero, then condenses onto a bone surface with a
 * hairline and backdrop blur. Desktop keeps the index inline; the full
 * index is always available through MENU.
 */
export default function Navbar() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const gsap = useGsap();

  const bar = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Condense on scroll */
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Entrance */
  useEffect(() => {
    const el = bar.current;
    if (!el || reduced || !gsap) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, delay: 0.15, ease: "expo.out" },
      );
      if (inner.current) {
        gsap.fromTo(
          inner.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, delay: 0.3, ease: "expo.out" },
        );
      }
    }, el);
    return () => ctx.revert();
  }, [gsap, reduced, pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* While the index overlay is open the bar must stay legible. */
  const opaque = solid || menuOpen;

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-[80]"
        data-solid={opaque ? "true" : "false"}
      >
        <div
          className={`transition-[background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            opaque
              ? "border-b border-ink-12 bg-bone/90 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div ref={inner} className="shell">
            <div
              className={`flex items-center justify-between transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                opaque ? "h-[58px] lg:h-[64px]" : "h-[74px] lg:h-[92px]"
              }`}
            >
              {/* Wordmark */}
              <Link
                href="/"
                className="group flex items-center gap-3"
                aria-label="Shreekumar Builders — home"
                data-cursor="Home"
              >
                <Monogram />
                <span className="flex flex-col leading-none">
                  <span className="meta text-[0.625rem] tracking-[0.24em] text-ink">
                    SHREEKUMAR
                  </span>
                  <span className="meta-sm mt-[3px] text-ink-45">BUILDERS</span>
                </span>
              </Link>

              {/* Desktop index */}
              <nav
                aria-label="Primary"
                className="hidden items-center gap-8 lg:flex xl:gap-11"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="link-rule meta text-ink-60 transition-colors duration-300 hover:text-ink"
                    data-active={isActive(item.href)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-3 md:gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (pathname !== "/") {
                      window.setTimeout(() => scrollToId("contact"), 60);
                    } else {
                      scrollToId("contact");
                    }
                  }}
                  className="link-rule meta hidden text-ink sm:inline"
                >
                  Start a project
                </button>

                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-expanded={menuOpen}
                  aria-haspopup="dialog"
                  className="group flex items-center gap-2.5"
                  data-cursor="Index"
                >
                  <span className="meta text-ink">
                    {menuOpen ? "Close" : "Menu"}
                  </span>
                  <span className="flex h-3 w-3 flex-col justify-between">
                    <span className="block h-px w-full bg-ink transition-transform duration-500 group-hover:translate-x-1" />
                    <span className="block h-px w-full bg-ink transition-transform duration-500 group-hover:-translate-x-1" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

/** Drawn SB monogram — two strokes, no icon library. */
function Monogram() {
  return (
    <span className="relative grid h-8 w-8 place-items-center border border-ink-25 transition-colors duration-500 group-hover:border-oxide lg:h-9 lg:w-9">
      <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden focusable="false">
        <path
          d="M4 19V5l8 9V5M12 14l8 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="square"
          className="text-ink transition-colors duration-500 group-hover:text-oxide"
        />
      </svg>
    </span>
  );
}