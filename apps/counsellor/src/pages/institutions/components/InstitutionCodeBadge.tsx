interface InstitutionCodeBadgeProps {
  code: string;
}

// The code renders like an ID stamp — square, monospaced, uppercase — to
// read as an official institutional marker rather than a decorative tag.
export function InstitutionCodeBadge({ code }: InstitutionCodeBadgeProps) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 font-mono text-[11px] font-semibold tracking-wide text-neutral-600">
      {code}
    </span>
  );
}