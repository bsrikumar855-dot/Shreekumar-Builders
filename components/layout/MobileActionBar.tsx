"use client";

import { useEffect, useState } from "react";
import { resolveContact } from "@/lib/data/site";

/**
 * MobileActionBar
 * On small screens the two things a visitor actually wants — call, and
 * message — stay reachable. Appears only after the hero has been passed so
 * it never competes with the first impression, and hides on the contact page
 * itself.
 */
export default function MobileActionBar() {
  const [show, setShow] = useState(false);
  const phone = resolveContact("phone");
  const whatsapp = resolveContact("whatsapp");

  useEffect(() => {
    const onScroll = () => {
      const onContactPage = window.location.pathname === "/contact";
      setShow(window.scrollY > window.innerHeight * 0.85 && !onContactPage);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[75] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="grid grid-cols-2 border-t border-ink-12 bg-bone/92 backdrop-blur-xl">
        <a
          href={phone.href ?? "/contact"}
          className="meta flex h-14 items-center justify-center gap-2 text-ink"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-oxide" />
          {phone.isPlaceholder ? "Call" : "Call"}
        </a>
        <a
          href={whatsapp.href ?? "/contact"}
          className="meta flex h-14 items-center justify-center gap-2 border-l border-ink-12 text-ink"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-oxide" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}