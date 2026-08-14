import { Navigate, Outlet, useLocation } from "react-router";
import { getSession } from "../lib/auth";
export default function ProtectedLayout() {
  const location = useLocation();
  const session = getSession();
  if (!session || session.user.type !== "INSTITUTION") return <Navigate to="/" replace state={{ from: location }} />;
  return <Outlet />;
}
