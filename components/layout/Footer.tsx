import Link from "next/link";
import { navItems, site, allContacts } from "@/lib/data/site";
import { services } from "@/lib/data/services";
import { LogoMark, Wordmark } from "@/components/ui/Bits";

export default function Footer() {
  const contacts = allContacts();
  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-cream">
      <div className="hazard h-3" aria-hidden />

      <div className="shell relative z-10 grid grid-cols-12 gap-x-6 gap-y-12 pb-10 pt-20 lg:pt-28">
        <div className="col-span-12 lg:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Shreekumar Builders — home">
            <LogoMark className="h-12 w-12" />
            <Wordmark light />
          </Link>
          <p className="mt-6 max-w-[40ch] text-cream-70">
            {site.tradeName}. Building, electrical, plumbing and tiling — planned on the same
            drawing and delivered by one team.
          </p>
          <Link href="/contact" className="btn btn-orange mt-8">
            Start a project <span className="arr" aria-hidden>→</span>
          </Link>
        </div>

        <nav aria-label="Footer" className="col-span-6 lg:col-span-2 lg:col-start-7">
          <h2 className="label text-orange">Explore</h2>
          <ul className="mt-5 space-y-1.5">
            {navItems.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="u-link inline-block py-1">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 lg:col-span-2">
          <h2 className="label text-orange">Trades</h2>
          <ul className="mt-5 space-y-1.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="u-link inline-block py-1">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-2">
          <h2 className="label text-orange">Contact</h2>
          <ul className="mt-5 space-y-1.5">
            {contacts.map((c) => (
              <li key={c.key}>
                {c.href ? (
                  <a href={c.href} className="u-link inline-block py-1">
                    {c.display}
                  </a>
                ) : (
                  <span className="text-cream-45">{c.display}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Giant wordmark rises into place */}
      <div className="relative z-0 -mb-[0.12em] select-none overflow-hidden" aria-hidden>
        <div
          data-parallax-scope
          className="font-display whitespace-nowrap text-center text-[clamp(4.5rem,21.5vw,24rem)] uppercase leading-[0.82] text-orange"
        >
          <div data-parallax="0.3">
            {"Shreekumar".split("").map((ch, i) => (
              <span key={i} className="lift-letter pointer-events-auto">
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-cream-15">
        <div className="shell label flex flex-wrap items-center justify-between gap-3 py-5 text-cream-45">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>{site.descriptor}</p>
        </div>
      </div>
    </footer>
  );
}
