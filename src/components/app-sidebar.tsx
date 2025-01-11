import * as React from "react"
import {
  BookOpen,
  Command,
  Ticket,
  ShoppingBasket,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/firebase"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {  

  const user = getCurrentUser() ? getCurrentUser() : {
    displayName: "Default User",
    email: "defaultuser@gmail.com"
  }

  const data = {
    user: {
      email: user!.email!,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Minimart",
        url: "#",
        icon: ShoppingBasket,
        isActive: true,
        items: [
          {
            title: "Available",
            url: "#",
          },
          {
            title: "Out of Stock",
            url: "#",
          },
        ],
      },
      {
        title: "Vouchers",
        url: "#",
        icon: Ticket,
        items: [
          {
            title: "Available",
            url: "#",
          },
        ],
      },
      {
        title: "History",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Past Transactions",
            url: "#",
          },
        ],
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MWH</span>
                  <span className="truncate text-xs">Online Minimart</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
