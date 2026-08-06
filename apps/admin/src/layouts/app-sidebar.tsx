import { Brain } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@repo/ui/components/sidebar";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Brain className="size-4" />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">Campus Care</span>
            <span className="text-xs text-muted-foreground">
              Admin Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}