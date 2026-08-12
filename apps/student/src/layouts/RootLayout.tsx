import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="relative flex min-h-screen flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <SidebarTrigger className="absolute left-4 top-4 z-50" />

        <Outlet />
      </main>
    </SidebarProvider>
  );
}