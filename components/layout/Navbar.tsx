"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/data/site";
import { getLenis } from "@/lib/utils/smooth-scroll";
import { LogoMark, Wordmark } from "@/components/ui/Bits";

/**
 * Navbar — five links and one CTA (the research-backed ceiling).
 * Hides on scroll down, returns on scroll up, gains a solid backing once the
 * page moves. Mobile uses a full-screen overlay menu.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The overlay menu is mounted after hydration only: browser extensions that
  // inject into dialog-like elements can no longer break server/client parity.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const last = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y > 220 && y > last.current + 6) setHidden(true);
        else if (y < last.current - 6 || y < 120) setHidden(false);
        last.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the menu on navigation
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  // Lock scroll (and Lenis) while the overlay is open; Esc closes it
  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Keep keyboard / screen-reader focus inside the open menu
    const behind = Array.from(document.querySelectorAll<HTMLElement>("#main, footer, a[href='#main']"));
    behind.forEach((n) => n.setAttribute("inert", ""));
    document.querySelector<HTMLElement>("#menu a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      behind.forEach((n) => n.removeAttribute("inert"));
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled || open ? "bg-cream/92 shadow-[0_2px_0_var(--color-ink)] backdrop-blur-md" : ""}`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Shreekumar Builders — home">
            <LogoMark />
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="u-link label py-3.5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="btn btn-orange btn-sm hidden sm:inline-flex">
              Let&apos;s get started
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="relative flex h-12 w-12 items-center justify-center border-2 border-ink bg-cream lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`absolute h-[2px] w-5 bg-ink transition-transform duration-500 ease-[var(--ease-out)] ${
                  open ? "rotate-45" : "-translate-y-[6px]"
                }`}
              />
              <span
                className={`absolute h-[2px] w-5 bg-ink transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-[2px] w-5 bg-ink transition-transform duration-500 ease-[var(--ease-out)] ${
                  open ? "-rotate-45" : "translate-y-[6px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      {mounted && (
      <div
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        className={`on-dark fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-orange px-[var(--spacing-gutter)] pb-10 pt-28 transition-[clip-path] duration-[800ms] ease-[var(--ease-inout)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${250 + i * 70}ms` : "0ms" }}
              className={`font-display flex items-baseline gap-4 text-[clamp(3rem,15vw,6rem)] uppercase leading-[1.02] text-ink transition-[transform,opacity] duration-700 ease-[var(--ease-out)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <span className="label text-ink">0{i + 1}</span>
              <span className={isActive(item.href) ? "outline-text" : ""}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-6">
          <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-ink w-full">
            Let&apos;s get started →
          </Link>
          <p className="label text-ink">Building · Electrical · Plumbing · Tiling</p>
        </div>
      </div>
      )}
    </>
  );
}
