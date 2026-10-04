"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGsap } from "@/lib/utils/motion";
import { usePrefersReducedMotion, useScrollLock } from "@/lib/utils/hooks";
import { getLenis } from "@/lib/utils/smooth-scroll";
import { navItems, site, allContacts } from "@/lib/data/site";
import { services } from "@/lib/data/services";

/**
 * MenuOverlay
 * The full index. Set like a contents page of a drawing set: primary
 * navigation, trades, and contact — all reachable in one movement.
 */
export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const contacts = allContacts();

  useScrollLock(open);
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (reduced) return;

    const ctx = gsap!.context(() => {
      if (open) {
        gsap!.timeline()
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
          .fromTo(
            el.querySelectorAll("[data-menu-row]"),
            { yPercent: 118, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.045, ease: "expo.out" },
            "-=0.42",
          )
          .fromTo(
            el.querySelectorAll("[data-menu-fade]"),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "expo.out" },
            "-=0.5",
          );
      }
    }, el);

    return () => ctx.revert();
  }, [open, gsap, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site index"
      className="surface-ink fixed inset-0 z-[70] grain overflow-y-auto"
    >
      <div className="relative flex min-h-full flex-col pt-[74px] lg:pt-[92px]">
        <div className="shell flex-1 pb-10">
          <div className="grid gap-y-10 pt-8 lg:grid-cols-12 lg:gap-x-8 lg:pt-14">
            {/* Primary index */}
            <nav aria-label="Index" className="lg:col-span-7">
              <p data-menu-fade className="meta mb-5 text-bone-45">
                Index
              </p>
              <ul>
                {navItems.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      data-menu-row
                      data-cursor="Go"
                      className="group flex items-baseline gap-4 border-b border-bone-14 py-2.5"
                    >
                      <span className="meta-sm w-8 shrink-0 text-bone-35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="display-2 translate-y-[0.06em] text-bone transition-colors duration-500 group-hover:text-oxide-tint md:text-[clamp(2.6rem,5.2vw,4.6rem)]">
                        {item.label}
                      </span>
                      <span className="meta-sm ml-auto self-center text-bone-35 transition-transform duration-500 group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Trades + contact */}
            <div className="flex flex-col gap-10 lg:col-span-5 lg:pl-10">
              <div>
                <p data-menu-fade className="meta mb-4 text-bone-45">
                  Trades
                </p>
                <ul className="grid grid-cols-2 gap-x-6">
                  {services.map((s) => (
                    <li key={s.slug} className="overflow-hidden">
                      <Link
                        href={`/services/${s.slug}`}
                        onClick={onClose}
                        data-menu-row
                        className="link-rule meta py-1.5 text-bone-70 transition-colors duration-300 hover:text-oxide-tint"
                      >
                        {s.index} · {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p data-menu-fade className="meta mb-4 text-bone-45">
                  Contact
                </p>
                <ul>
                  {contacts.map((c) => (
                    <li key={c.key} className="overflow-hidden" data-menu-fade>
                      <a
                        href={c.href ?? "/contact"}
                        onClick={onClose}
                        className="flex items-baseline gap-4 border-b border-bone-14 py-2.5"
                      >
                        <span className="meta-sm w-20 shrink-0 text-bone-35">{c.label}</span>
                        <span
                          className={`text-[0.95rem] transition-colors duration-300 hover:text-oxide-tint ${
                            c.isPlaceholder ? "text-bone-35" : "text-bone"
                          }`}
                        >
                          {c.display}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer data-menu-fade className="shell border-t border-bone-14 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="meta-sm text-bone-45">
              {site.tradeName}
            </p>
            <p className="meta-sm text-bone-45">
              {pathname === "/" ? "Index" : pathname}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}