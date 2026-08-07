import { MessageCircle , ClipboardClock } from "lucide-react";
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
    title: "Book Appointment",
    url: "/book-appointment",
    icon: ClipboardClock,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
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