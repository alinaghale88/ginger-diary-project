import { House, BookOpenText, Search, Images, FolderOutput, UserPen } from "lucide-react"
import { useLogout } from "@/hooks/useLogout"
import { useAuthContext } from "@/hooks/useAuthContext"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
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
    const { user } = useAuthContext()

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
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {user && (
                    <div>
                        <span>{user.email}</span>
                        <SidebarMenuButton asChild onClick={handleClick}>
                            <span className="text-red-500 cursor-pointer">Logout</span>
                        </SidebarMenuButton>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
