import Link from "next/link";
import { site, navItems, allContacts } from "@/lib/data/site";
import { services } from "@/lib/data/services";
import { TickChain } from "@/components/ui/Drafting";

/**
 * Footer
 * Minimal and architectural: a drawn baseline, the wordmark set large, the
 * index, and the trades. No invented legal text, no invented social links.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const contacts = allContacts();

  return (
    <footer
      data-surface="ink"
      className="surface-ink grain relative overflow-hidden text-bone"
    >
      <TickChain tone="dark" className="opacity-60" />

      <div className="shell relative py-14 lg:py-20">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
          {/* Wordmark block */}
          <div className="lg:col-span-5">
            <p className="display-2 text-bone md:text-[clamp(2.6rem,5.4vw,4.9rem)]">
              Shreekumar
              <br />
              <span className="text-bone-45">Builders</span>
            </p>
            <p className="meta-sm mt-6 max-w-[30ch] leading-[1.9] text-bone-45">
              {site.tradeName}
            </p>
            <p className="meta-sm mt-1 text-bone-35">
              Building · Civil · Electrical · Plumbing · Tiling
            </p>
          </div>

          {/* Index */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="meta mb-5 text-bone-35">Index</p>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-rule text-[0.95rem] text-bone-70 transition-colors duration-300 hover:text-oxide-tint"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Trades */}
          <nav aria-label="Services" className="lg:col-span-2">
            <p className="meta mb-5 text-bone-35">Trades</p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="link-rule text-[0.95rem] text-bone-70 transition-colors duration-300 hover:text-oxide-tint"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-2">
            <p className="meta mb-5 text-bone-35">Contact</p>
            <ul className="space-y-2.5">
              {contacts.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href ?? "/contact"}
                    className={`link-rule block text-[0.95rem] transition-colors duration-300 hover:text-oxide-tint ${
                      c.isPlaceholder ? "text-bone-35" : "text-bone-70"
                    }`}
                  >
                    <span className="meta-sm mr-2 text-bone-25">{c.label}</span>
                    {c.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-bone-14 pt-6 lg:mt-20">
          <p className="meta-sm text-bone-35">
            © {year} {site.name}
          </p>
          <p className="meta-sm text-bone-35">
            {site.descriptor}
          </p>
        </div>
      </div>
    </footer>
  );
}