import { House, BookOpenText, Search, Images, FolderOutput, UserPen } from "lucide-react"
import { useLogout } from "@/hooks/useLogout"
import { useAuthContext } from "@/hooks/useAuthContext"
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useChapterStore } from "@/store/chapter"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: House
    },
    {
        title: "Chapter",
        url: "/create-chapter",
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
]

export function AppSidebar() {

    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }

    const { chapters, fetchChapters } = useChapterStore(); // Fetch chapters from store

    const [selectedChapter, setSelectedChapter] = useState(null); // Store selected chapter
    const [loading, setLoading] = useState(false);

    // Fetch all chapters when the modal opens
    useEffect(() => {
        if (user) {
            fetchChapters(user);
        }
    }, [fetchChapters, user]);


    return (
        <Sidebar>
            <SidebarHeader className="items-center">
                <div className="px-4 py-1 flex items-center">
                    <Link to="/">
                        <img src="/ginger-diary-logo.png" alt="Ginger Diary Logo" className="w-40" />
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span className="text-base ml-2 tracking-wider">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <SidebarMenuButton>
                                            <FolderOutput /><span className="text-base ml-2">Export</span>
                                        </SidebarMenuButton>
                                    </DialogTrigger>
                                    <DialogContent className="!rounded-xl">
                                        <DialogHeader>
                                            <DialogTitle>Export Chapter</DialogTitle>
                                            <p>Select a chapter to export as a PDF.</p>
                                        </DialogHeader>
                                        {/* Dropdown to select a chapter */}
                                        {!loading && (
                                            <div className="relative">
                                                <Select onValueChange={(value) => {
                                                    const chapter = chapters.find(ch => ch._id === value);
                                                    setSelectedChapter(chapter);
                                                }}>
                                                    <SelectTrigger className="max-w-[200px]">
                                                        <SelectValue placeholder="Choose a Chapter" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {chapters.map((chapter) => (
                                                            <SelectItem key={chapter._id} value={chapter._id}>
                                                                {chapter.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <DialogFooter>
                                            <Button type="submit">Confirm</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton>
                                            <UserPen /><span className="text-base ml-2">{user.email}</span>
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem className="mb-0" onClick={handleClick}>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
