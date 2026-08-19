export type Session = { token: string; user: { id: string; email: string; name?: string | null; type: "STUDENT" | "COUNSELLOR" | "INSTITUTION"; counsellorEmail?: string | null } };
const key = "campus-care.session";
export const getSession = (): Session | null => { try { return JSON.parse(localStorage.getItem(key) ?? "null"); } catch { return null; } };
export const saveSession = (session: Session) => localStorage.setItem(key, JSON.stringify(session));
export const clearSession = () => localStorage.removeItem(key);
