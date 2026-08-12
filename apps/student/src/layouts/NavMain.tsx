import { MessageCircle, ClipboardClock, BotMessageSquare, Heart, BookOpenCheck, UsersRound } from "lucide-react";
import { NavLink } from "react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";

const counsellorItems = [
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

const aiCompanionItems = [
  {
    title: "Emora AI",
    url: "/emora",
    icon: BotMessageSquare,
  }
];

const personalSpaceItems = [
  {
    title: "Daily Check in",
    url: "/daily-checkin",
    icon: BookOpenCheck,
  },
  {
    title: "Emotional Audit",
    url: "/emotional-audit",
    icon: Heart,
  },
  {
    title: "Peer Support Forum",
    url: "/peer-support",
    icon: UsersRound,
  },
];

const sections = [
  {
    label: "Talk to Counsellors",
    items: counsellorItems,
  },
  {
    label: "Your AI companion",
    items: aiCompanionItems,
  },
  {
    label: "Your personal space",
    items: personalSpaceItems,
  },
];

export function NavMain() {
  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>
            {section.label}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="p-0"
                  >
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `
        flex w-full items-center gap-2 rounded-md px-2 py-2
        group-data-[collapsible=icon]:size-8
        group-data-[collapsible=icon]:justify-center
        group-data-[collapsible=icon]:gap-0
        group-data-[collapsible=icon]:p-0
        ${isActive
                          ? "bg-muted text-primary"
                          : "hover:bg-muted"
                        }
        `
                      }
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}