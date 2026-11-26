import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import EnquiryForm from "@/components/sections/EnquiryForm";
import { PendingNote } from "@/components/ui/Bits";
import { services } from "@/lib/data/services";
import { allContacts, resolveContact, site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Shreekumar Builders — building and civil works, electrical, plumbing and tiling.",
  alternates: { canonical: "/contact" },
};

const brief = [
  ["What to send", "The location, what the space has to do, and any drawings or plans you already have."],
  ["What you get back", "An honest read on what is possible, what it needs and the order it should be built in."],
  ["Residential & commercial", "Building, civil, electrical, plumbing and tiling work — planned as one scope."],
] as const;

export default function ContactPage() {
  const contacts = allContacts();
  const wa = resolveContact("whatsapp");
  const mail = resolveContact("email");
  const email = mail.href ? mail.href.replace("mailto:", "") : null;
  const address = resolveContact("address");

  return (
    <>
      <PageHeader
        index="07"
        label="Contact"
        lines={["Let's start", "with the site"]}
        lead={`${site.name} carries out building and civil works, electrical, plumbing and tile laying for residential and commercial projects.`}
        meta={[{ k: "Trades", v: "06" }]}
      />

      <section className="bg-sand py-[var(--spacing-section)]" aria-label="Enquiry">
        <div className="shell grid grid-cols-12 gap-x-10 gap-y-14">
          <div className="col-span-12 lg:col-span-7" data-reveal>
            <EnquiryForm
              whatsapp={wa.href}
              email={email}
              trades={services.map((s) => s.title)}
            />
          </div>

          <aside className="col-span-12 space-y-8 lg:col-span-5">
            <div className="card on-dark bg-ink p-6 text-cream lg:p-8" data-reveal="right">
              <h2 className="label text-orange">Reach us</h2>
              <ul className="mt-5">
                {contacts.map((c) => (
                  <li key={c.key} className="border-t border-cream-15 py-4">
                    <p className="label text-cream-45">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="font-display u-link mt-1 inline-block text-3xl uppercase leading-none">
                        {c.display}
                      </a>
                    ) : (
                      <p className="font-display mt-1 text-3xl uppercase leading-none text-cream-45">
                        {c.display}
                      </p>
                    )}
                  </li>
                ))}
                <li className="border-t border-cream-15 py-4">
                  <p className="label text-cream-45">{address.label}</p>
                  <p className="mt-1 text-cream-45">{address.display}</p>
                </li>
              </ul>
              <div className="mt-4 text-ink">
                <PendingNote>Replace contact details in lib/data/site.ts</PendingNote>
              </div>
            </div>

            <div className="card bg-orange p-6 lg:p-8" data-reveal="right" data-delay="120">
              <h2 className="label">How a project begins</h2>
              <dl className="mt-4">
                {brief.map(([k, v]) => (
                  <div key={k} className="border-t-2 border-ink py-4">
                    <dt className="font-display text-xl uppercase leading-none">{k}</dt>
                    <dd className="mt-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
