// utils/formatDate.ts

/**
 * Formats an ISO date string into a friendly, readable format.
 * Example: "2025-06-10" -> "Jun 10, 2025"
 */
export function formatFriendlyDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Returns today's date as an ISO date string (YYYY-MM-DD).
 */
export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Returns a short weekday label, e.g. "Mon".
 */
export function getWeekdayLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}