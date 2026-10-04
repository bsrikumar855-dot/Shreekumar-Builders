/**
 * SITE / COMPANY DATA
 * ---------------------------------------------------------------------------
 * !! REAL-COMPANY-DATA REQUIRED !!
 *
 * Every field in `contact` below is intentionally EMPTY because no verified
 * company contact details were supplied for this build. The UI renders clearly
 * marked placeholders instead of invented values.
 *
 * To go live, replace the `null` values with the real details:
 *   phone.value     -> "+91XXXXXXXXXX"
 *   whatsapp.value  -> "91XXXXXXXXXX"   (country code + number, digits only)
 *   email.value     -> "info@example.com"
 *   location.value  -> "Area, City, State"
 *   address.value   -> full postal address
 *
 * Nothing else in the codebase needs to change — every call site resolves
 * contact details through `resolveContact()`.
 */

export type ContactKey = "phone" | "whatsapp" | "email" | "location" | "address";

export type ContactEntry = {
  value: string | null;
  placeholder: string;
  /** Set once `value` is filled in. */
  label: string;
};

export const site = {
  name: "Shreekumar Builders",
  tradeName: "Shreekumar Electrical & Plumbing Works",
  descriptor: "Building · Civil · Electrical · Plumbing · Tiling",

  /**
   * Founding year is unknown — deliberately not invented.
   * Set this to e.g. "1998" once confirmed, or leave null to hide the mark.
   */
  founded: null as string | null,

  url: "https://shreekumarbuilders.com",
  locale: "en_IN",

  seo: {
    title: "Shreekumar Builders | Building, Electrical, Plumbing & Tiling",
    description:
      "Shreekumar Builders — building and civil works, electrical, plumbing and tile laying delivered as one coordinated scope. Precision in execution, discipline in the details.",
  },

  contact: {
    phone: {
      value: null,
      placeholder: "[PHONE NUMBER]",
      label: "Call",
    } satisfies ContactEntry,
    whatsapp: {
      value: null,
      placeholder: "[WHATSAPP NUMBER]",
      label: "WhatsApp",
    } satisfies ContactEntry,
    email: {
      value: null,
      placeholder: "[EMAIL ADDRESS]",
      label: "Email",
    } satisfies ContactEntry,
    location: {
      value: null,
      placeholder: "[LOCATION]",
      label: "Location",
    } satisfies ContactEntry,
    address: {
      value: null,
      placeholder: "[FULL ADDRESS]",
      label: "Address",
    } satisfies ContactEntry,
  },

  /**
   * Proof points. Every entry is null because no verified figures were
   * supplied. Nothing is displayed until a real value is provided —
   * no invented statistics, no invented project counts.
   */
  stats: [
    { key: "projects", label: "Projects delivered", value: null as string | null },
    { key: "years", label: "Years in trade", value: null as string | null },
    { key: "team", label: "Trades on site", value: null as string | null },
  ],

  social: [] as { label: string; href: string }[],
} as const;

export type ResolvedContact = {
  key: ContactKey;
  label: string;
  display: string;
  href: string | null;
  isPlaceholder: boolean;
};

/**
 * Single source of truth for rendering contact details.
 * Falls back to a visible placeholder when a real value is not yet supplied.
 */
export function resolveContact(key: ContactKey): ResolvedContact {
  const entry = site.contact[key] as ContactEntry;
  const isPlaceholder = !entry.value;

  let href: string | null = null;
  if (!isPlaceholder && entry.value) {
    if (key === "phone") href = `tel:${entry.value.replace(/[^+\d]/g, "")}`;
    if (key === "whatsapp") href = `https://wa.me/${entry.value.replace(/\D/g, "")}`;
    if (key === "email") href = `mailto:${entry.value}`;
    if (key === "location" || key === "address") href = null;
  }

  return {
    key,
    label: entry.label,
    display: entry.value ?? entry.placeholder,
    href,
    isPlaceholder,
  };
}

export function allContacts(): ResolvedContact[] {
  return (["phone", "whatsapp", "email", "location"] as ContactKey[]).map(resolveContact);
}

export function hasRealContact(): boolean {
  return (Object.keys(site.contact) as ContactKey[]).some((k) => !!site.contact[k].value);
}

export const navItems = [
  { label: "Index", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;