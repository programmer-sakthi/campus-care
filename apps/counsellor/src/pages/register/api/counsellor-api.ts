const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function registerCounsellor(data: {
  email: string;
  name?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/counsellors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.message ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}