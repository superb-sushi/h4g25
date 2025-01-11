"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      setters: Array<React.Dispatch<React.SetStateAction<boolean>>>
    }[]
  }[]
}) {

  const handleSelectItem = (item: {
    title: string
    url: string
    setters: Array<React.Dispatch<React.SetStateAction<boolean>>>
  }) => {
    if (item.title == "Available") {
      for (let i = 0; i < item.setters.length; i++) {
        if (i == 0) {
          item.setters[i](true);
        } else {
          item.setters[i](false);
        }
      }
    } else if (item.title == "Out of Stock") {
      for (let i = 0; i < item.setters.length; i++) {
        if (i == 1) {
          item.setters[i](true);
        } else {
          item.setters[i](false);
        }
      }
    } else if (item.title == "Owned") {
      for (let i = 0; i < item.setters.length; i++) {
        if (i == 2) {
          item.setters[i](true);
        } else {
          item.setters[i](false);
        }
      }
    } else if (item.title == "Auction") {
      for (let i = 0; i < item.setters.length; i++) {
        if (i == 3) {
          item.setters[i](true);
        } else {
          item.setters[i](false);
        }
      }
    } else if (item.title == "Past Transactions") {
      for (let i = 0; i < item.setters.length; i++) {
        if (i == 4) {
          item.setters[i](true);
        } else {
          item.setters[i](false);
        }
      }
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url} onClick={() => handleSelectItem(subItem)}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
