import { Home, Users,GraduationCap , ChartNoAxesCombined } from "lucide-react";
import { NavLink } from "react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Counsellors",
    url: "/counsellors",
    icon: Users,
  },
  {
    title: "Students",
    url: "/students",
    icon: GraduationCap,
  },
  {
    title: "Insights",
    url: "/insights",
    icon: ChartNoAxesCombined,
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
            <NavLink
              to={item.url}
              className="flex items-center gap-2"
            >
                <SidebarMenuButton asChild tooltip={item.title}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
            </NavLink>
              </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}