'use client'

import { CreditCardIcon, FolderOpen, HistoryIcon, KeyIcon, LogOutIcon, StarIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

 

const menuitems = [
    {
        title: "Main",
        items: [
            {
                title : "Workflows",
                icon: FolderOpen,
                url: "/workflows"
            }, 
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials"
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions"
            }
        ]
    }
]

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                        <Link href="/" prefetch>
                        <span className="font-semibold text-sm">MIRO</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuitems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuButton
                                key={item.url}
                                tooltip={item.title}
                                isActive={
                                    item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)
                                } 
                                asChild
                                className="gap-x-4 h-10 px-4"
                                >
                            <Link href={item.url} prefetch>
                            <item.icon className="size-4"></item.icon>
                            <span>{item.title}</span>
                            </Link>
                                </SidebarMenuButton>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuButton
                    tooltip="Upgrade to pro"
                    className="gp-x-4 h-10 px-4"
                    onClick={()=>{}}
                    >
                        <StarIcon className="h-4 w-4"/>
                        <span>Upgrade to Pro</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                    tooltip="Billing Portal"
                    className="gp-x-4 h-10 px-4"
                    onClick={()=>{}}
                    >
                        <CreditCardIcon className="h-4 w-4"/>
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                    tooltip="Sign out"
                    className="gap-x-4 h-10 px-4"
                    onClick={()=> authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                router.push("/login")
                            }
                        }
                    })}
                    >
                        <LogOutIcon className="h-4 w-4"/>
                        <span>Sign out</span>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}