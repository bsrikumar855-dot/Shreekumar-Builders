import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { SectionMark, TickChain } from "@/components/ui/Drafting";
import PendingNote from "@/components/ui/PendingNote";
import { site, allContacts, resolveContact } from "@/lib/data/site";

/**
 * Contact — Act 06
 * The closing chapter. Set as a specification block: label, value, and a
 * plain statement of what to send. Nothing is invented — unverified contact
 * details render as clearly marked placeholders.
 */
export default function ContactSection() {
  const contacts = allContacts();
  const address = resolveContact("address");

  return (
    <section
      id="contact"
      data-surface="ink"
      aria-labelledby="contact-title"
      className="surface-ink grain relative overflow-hidden py-[var(--spacing-section)] text-bone"
    >
      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionMark index="11" label="Contact" tone="dark" />
          <p className="meta max-w-[28ch] text-bone-35">
            Send the location, the drawings, the brief
          </p>
        </div>

        <h2 id="contact-title" className="mt-8 lg:mt-12">
          <RevealText
            text="Have a project"
            className="display block text-bone"
            wordClassName="text-bone"
          />
          <RevealText
            text="in mind?"
            className="serif display block font-normal italic text-oxide-tint"
            wordClassName="text-oxide-tint"
            delay={0.1}
          />
        </h2>

        {/* Specification block */}
        <div className="mt-12 lg:mt-16">
          <TickChain tone="dark" className="opacity-70" />

          <ul>
            {contacts.map((c) => (
              <li key={c.key}>
                <Reveal y={22}>
                  <a
                    href={c.href ?? "/contact"}
                    className="group flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-bone-14 py-6 lg:py-8"
                  >
                    <span className="meta w-24 shrink-0 text-bone-35">{c.label}</span>
                    <span
                      className={`flex-1 text-[clamp(1.4rem,3.4vw,3rem)] leading-none tracking-[-0.038em] transition-colors duration-500 ${
                        c.isPlaceholder
                          ? "text-bone-35"
                          : "text-bone group-hover:text-oxide-tint"
                      }`}
                    >
                      {c.display}
                    </span>
                    <span
                      aria-hidden
                      className="meta-sm self-center text-bone-25 transition-transform duration-500 group-hover:translate-x-1.5"
                    >
                      {c.href ? "↗" : "—"}
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}

            <li>
              <Reveal y={22}>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-bone-14 py-6 lg:py-8">
                  <span className="meta w-24 shrink-0 text-bone-35">
                    {address.label}
                  </span>
                  <span className="flex-1 text-[clamp(1.1rem,2.2vw,1.75rem)] leading-tight tracking-[-0.03em] text-bone-35">
                    {address.display}
                  </span>
                </div>
              </Reveal>
            </li>
          </ul>
        </div>

        <div className="mt-10 grid grid-cols-12 items-end gap-x-5 gap-y-8 lg:mt-14 lg:gap-x-8">
          <Reveal y={22} className="col-span-12 lg:col-span-6">
            <p className="body-copy max-w-[52ch] text-bone-60">
              {site.name} carries out building and civil work, electrical,
              plumbing and tile laying for residential and commercial projects.
              Tell us what the space has to do and we will tell you what it takes.
            </p>
          </Reveal>

          <Reveal y={22} delay={0.1} className="col-span-12 lg:col-span-4 lg:col-start-9 lg:text-right">
            <p className="meta text-bone-35">{site.tradeName}</p>
            <p className="meta-sm mt-2 text-bone-25">{site.descriptor}</p>
            <PendingNote className="mt-5 border-bone-35 bg-transparent text-oxide-tint">
              Replace contact details in lib/data/site.ts
            </PendingNote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}