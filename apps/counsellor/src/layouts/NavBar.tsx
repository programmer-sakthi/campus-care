import { NavLink, Outlet } from "react-router";

const links = [
  { to: "/chat", label: "Chat" },
  { to: "/appointments", label: "Appointments" },
  { to: "/institutions", label: "Institutions" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-slate-100">
      {/* Floating Header */}
      <header className="fixed inset-x-0 top-6 z-50 flex justify-center">
        <nav className="flex rounded-2xl bg-black/90 p-1 shadow-2xl backdrop-blur-md">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "rounded-xl px-6 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-black"
                    : "text-white hover:bg-neutral-800",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Header floats over this */}
      <main className="relative min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}