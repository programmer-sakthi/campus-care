import { Brain, LogOut, User } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@repo/ui/components/dropdown-menu";

import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";

const links = [
  { to: "/chat", label: "Chat" },
  { to: "/appointments", label: "Appointments" },
  { to: "/institutions", label: "Institutions" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-slate-100">
      <header className="fixed inset-x-0 top-6 z-50 flex justify-center">
        <div className="flex h-16 items-center gap-4 rounded-2xl border border-neutral-800 bg-black/90 px-4 shadow-2xl backdrop-blur-md">

          {/* Logo */}
          <NavLink
            to="/chat"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-white transition-colors hover:bg-neutral-800"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Brain className="size-4" />
            </div>

            <span className="font-semibold whitespace-nowrap">
              Campus Care.
            </span>
          </NavLink>

          <div className="h-8 w-px bg-neutral-700" />

          {/* Navigation */}
          <nav className="flex items-center">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white text-black shadow"
                      : "text-white hover:bg-neutral-800",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="h-8 w-px bg-neutral-700" />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none ring-offset-background transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="size-10 cursor-pointer">
                  <AvatarFallback className="bg-neutral-800 text-white">
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">John Doe</span>
                    <span className="text-muted-foreground text-xs">
                      Counsellor
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <LogOut className="mr-2 size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="relative min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}