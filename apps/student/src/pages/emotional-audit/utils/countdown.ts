// utils/countdown.ts

/** "3 days 4 hours" / "6 hours" / "less than an hour" from a whole hour count. */
export function formatHoursRemaining(hoursRemaining: number): string {
  if (hoursRemaining <= 0) return "now";
  if (hoursRemaining < 1) return "less than an hour";

  const days = Math.floor(hoursRemaining / 24);
  const hours = hoursRemaining % 24;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  return parts.join(" ") || "less than an hour";
}

export function formatFriendlyDateTime(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
