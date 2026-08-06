import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-screen flex-1 flex-col">
        <SidebarTrigger />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}