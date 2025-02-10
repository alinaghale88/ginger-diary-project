import { House, BookOpenText, Search, Images, FolderOutput, UserPen } from "lucide-react"
import { useLogout } from "@/hooks/useLogout"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: House
    },
    {
        title: "Chapter",
        url: "#",
        icon: BookOpenText,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Gallery",
        url: "#",
        icon: Images,
    },
    {
        title: "Export",
        url: "#",
        icon: FolderOutput,
    },
    {
        title: "Profile",
        url: "#",
        icon: UserPen,
    },
]

export function AppSidebar() {

    const { logout } = useLogout()

    const handleClick = () => {
        logout()
    }
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild onClick={handleClick}>
                                    <span>Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
