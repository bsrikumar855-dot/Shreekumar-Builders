/**
 * PendingNote
 * A development-only marker. Makes it obvious which copy is still awaiting
 * verified company information, without putting placeholder text into the
 * public design. Never rendered in a production build.
 */
export default function PendingNote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <p
      className={`meta-sm inline-flex items-center gap-2 border border-dashed border-oxide/60 bg-oxide/5 px-2.5 py-1.5 text-oxide-deep ${className}`}
    >
      <span aria-hidden>△</span>
      {children}
    </p>
  );
}