export function formatDateTime(iso?: string | Date | null) {
  if (!iso) return "";

  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string | Date) {
  const diffMs = Date.now() - new Date(iso).getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";

  return `${days} days ago`;
}

export function toDatetimeLocal(iso?: string | Date | null) {
  const d = iso ? new Date(iso) : new Date();

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
