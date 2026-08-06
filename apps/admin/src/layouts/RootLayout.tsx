import { SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Outlet } from "react-router"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}