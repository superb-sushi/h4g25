import * as React from "react"
import {
  BookOpen,
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

import { User } from "../schema/User";

import mwhicon from "../assets/mwhicon.jpg";

export function AppSidebar({user, setStates} : { user: User, setStates: Array<React.Dispatch<React.SetStateAction<boolean>>>}) {  

  const data = {
    user: user,
    navMain: [
      {
        title: "Minimart",
        url: "#minimart",
        icon: ShoppingBasket,
        isActive: true,
        items: [
          {
            title: "Available",
            url: "#available",
            setters: setStates
          },
          {
            title: "Out of Stock",
            url: "#outofstock",
            setters: setStates
          },
        ],
      },
      {
        title: "Vouchers",
        url: "#vouchers",
        icon: Ticket,
        items: [
          {
            title: "Owned",
            url: "#owned",
            setters: setStates
          },
          {
            title: "Auction",
            url: "#auction",
            setters: setStates
          },
        ],
      },
      {
        title: "History",
        url: "#history",
        icon: BookOpen,
        items: [
          {
            title: "Past Transactions",
            url: "#pasttransactions",
            setters: setStates
          },
        ],
      },
    ],
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <img src={mwhicon} className="aspect-square size-8"/>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MWH</span>
                  <span className="truncate text-xs">Online Minimart</span>
                </div>
              </div>
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
