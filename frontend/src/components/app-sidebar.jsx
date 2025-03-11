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
import { Link } from "react-router-dom"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: House
    },
    {
        title: "Chapter",
        url: "/chapter",
        icon: BookOpenText,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Gallery",
        url: "/gallery",
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
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span className="text-base ml-2">{item.title}</span>
                                        </Link>
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
