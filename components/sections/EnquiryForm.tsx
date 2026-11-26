"use client";

import { useState } from "react";

type Props = {
  /** Resolved WhatsApp link base (https://wa.me/…) or null when not configured. */
  whatsapp: string | null;
  /** mailto: address or null when not configured. */
  email: string | null;
  trades: string[];
};

/**
 * Enquiry form. There is no backend: on submit the brief is handed to the
 * visitor's own WhatsApp or email app, prefilled. While no contact channel
 * is configured in lib/data/site.ts it says so plainly instead of pretending
 * to send.
 */
export default function EnquiryForm({ whatsapp, email, trades }: Props) {
  const [status, setStatus] = useState<"idle" | "sent" | "unconfigured">("idle");
  const configured = Boolean(whatsapp || email);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      `Trade: ${f.get("trade")}`,
      `Location: ${f.get("location")}`,
      "",
      String(f.get("brief") ?? ""),
    ].join("\n");

    if (whatsapp) {
      window.open(`${whatsapp}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
      setStatus("sent");
    } else if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        "Project enquiry",
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    } else {
      setStatus("unconfigured");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6 bg-paper p-6 lg:p-9" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="label mb-2 block">Your name</span>
          <input name="name" required autoComplete="name" className="field" placeholder="Full name" />
        </label>
        <label className="block">
          <span className="label mb-2 block">Phone</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className="field"
            placeholder="Mobile number"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="label mb-2 block">What do you need?</span>
          <select name="trade" className="field" defaultValue={trades[0]}>
            {trades.map((t) => (
              <option key={t}>{t}</option>
            ))}
            <option>Not sure yet</option>
          </select>
        </label>
        <label className="block">
          <span className="label mb-2 block">Site location</span>
          <input name="location" className="field" placeholder="Area, city" autoComplete="address-level2" />
        </label>
      </div>

      <label className="block">
        <span className="label mb-2 block">Brief</span>
        <textarea
          name="brief"
          rows={5}
          required
          className="field resize-y"
          placeholder="What the space has to do, drawings you have, timeline…"
        />
      </label>

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn btn-orange">
          Send enquiry <span className="arr" aria-hidden>→</span>
        </button>
        {!configured && (
          <p className="label max-w-[34ch] text-rust" role="note">
            Contact channels are not configured yet — set them in lib/data/site.ts
          </p>
        )}
      </div>

      <p role="status" aria-live="polite" className="label min-h-[1.2em]">
        {status === "sent" && "Opened in your app — press send there to finish."}
        {status === "unconfigured" &&
          "This form can’t send yet: the company’s phone / email haven’t been added."}
      </p>
    </form>
  );
}
