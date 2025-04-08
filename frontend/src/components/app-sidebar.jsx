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
import { useEntryStore } from "@/store/entry"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

// Menu items
const items = [
    { title: "Home", url: "/", icon: House },
    { title: "Chapter", url: "/create-chapter", icon: BookOpenText },
    { title: "Search", url: "#", icon: Search },
    { title: "Gallery", url: "/gallery", icon: Images },
]


export function AppSidebar() {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const { chapters, fetchChapters, getChapterById } = useChapterStore()
    const { fetchEntriesByChapter } = useEntryStore()

    const [selectedChapter, setSelectedChapter] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false) // Modal state

    useEffect(() => {
        if (user) fetchChapters(user)
    }, [fetchChapters, user])

    const handleExport = async () => {
        if (!selectedChapter) return;

        const doc = new jsPDF();
        const margin = 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = margin + 10; // Add a little margin at the top to start the content lower

        // Render Chapter Title (Big and Bold)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(30); // Big font for the title
        doc.text(selectedChapter.name || "Untitled", pageWidth / 2, y, { align: "center" });
        y += 15; // Reduce space after the title (less space before the image)

        // Render Chapter Cover Image (Centered)
        if (selectedChapter.coverImage) {
            try {
                const img = await loadImage(selectedChapter.coverImage);
                const imgWidth = 150;
                const imgHeight = (img.height * imgWidth) / img.width;
                const x = (pageWidth - imgWidth) / 2; // Center the image
                doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);
                y += imgHeight + 10; // Reduced space after the image
            } catch (err) {
                console.log("Error loading image:", err);
            }
        }
        y += 5;
        // Render Chapter Description (Smaller text but readable)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const description = selectedChapter.description || "No description.";
        const descLines = doc.splitTextToSize(description, 150);

        const contentWidth = 140;  // Maximum width for the description text
        const xCenter = (pageWidth - contentWidth) / 2;  // Calculate horizontal center

        descLines.forEach(line => {
            if (y + 10 > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, xCenter, y);
            y += 8;
        });

        // Add a page break after the chapter content
        doc.addPage();
        y = margin + 5; // Start content with some margin from the top

        // Render Entries
        const entryIds = selectedChapter.entries || [];
        for (const entryId of entryIds) {
            const entryData = await fetchEntryContent(entryId);
            if (entryData) {
                // Add timestamp before each entry
                doc.setFont("helvetica", "normal");
                doc.setFontSize(12);
                doc.setTextColor(107, 114, 128); // Grey color for timestamp

                // Add the timestamp text
                doc.text(new Date(entryData.createdAt).toLocaleString(), margin, y + 5);
                y += 20; // Increase spacing after the timestamp

                // Directly use the HTML content without sanitization
                const docContent = new DOMParser().parseFromString(entryData.content || "", 'text/html');

                // Set the default font style
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);

                // Process each HTML element and add to PDF
                for (const node of docContent.body.childNodes) {
                    if (node.nodeName === 'P') {
                        // Add paragraph breaks
                        for (const childNode of node.childNodes) {
                            if (childNode.nodeType === Node.TEXT_NODE) {
                                // Add regular text (without any HTML formatting)
                                const lines = doc.splitTextToSize(childNode.textContent, pageWidth - margin * 2);
                                lines.forEach(line => {
                                    doc.text(line, margin, y);
                                    y += 8;
                                });
                            }
                            else if (childNode.nodeName === 'STRONG' || childNode.nodeName === 'B') {
                                // Handle bold text
                                doc.setFont("helvetica", "bold");
                                const lines = doc.splitTextToSize(childNode.textContent, pageWidth - margin * 2);
                                lines.forEach(line => {
                                    doc.text(line, margin, y);
                                    y += 8;
                                });
                                doc.setFont("helvetica", "normal"); // Reset the font style
                            }
                            else if (childNode.nodeName === 'EM' || childNode.nodeName === 'I') {
                                // Handle italic text
                                doc.setFont("helvetica", "italic");
                                const lines = doc.splitTextToSize(childNode.textContent, pageWidth - margin * 2);
                                lines.forEach(line => {
                                    doc.text(line, margin, y);
                                    y += 8;
                                });
                                doc.setFont("helvetica", "normal"); // Reset the font style
                            }
                            else if (childNode.nodeName === 'IMG') {
                                // Handle images inside the paragraph
                                const imgSrc = childNode.getAttribute('src');
                                try {
                                    const img = await loadImage(imgSrc);

                                    // Set the width and height based on the natural size of the image
                                    let imgWidth = img.width;  // Use the image's natural width
                                    let imgHeight = img.height; // Use the image's natural height

                                    // If the image is too large, scale it down to fit within the page's width
                                    const maxWidth = pageWidth - margin * 2;
                                    if (imgWidth > maxWidth) {
                                        const scaleFactor = maxWidth / imgWidth;
                                        imgWidth = maxWidth;
                                        imgHeight = imgHeight * scaleFactor;
                                    }

                                    if (y + imgHeight + 10 > pageHeight - margin) {
                                        doc.addPage();
                                        y = margin;
                                    }

                                    // Add the image to the PDF
                                    doc.addImage(img, "JPEG", margin, y, imgWidth, imgHeight);
                                    y += imgHeight + 10; // Adjust the y position for the next content
                                } catch (err) {
                                    console.log("Error loading image:", err);
                                }
                            }
                        }
                    }
                }

                y += 10;
            }
            doc.addPage();
            y = margin + 5;
        }

        doc.save(`${selectedChapter.name || "chapter"}.pdf`);

        // Close the modal and reset the state after export
        setIsDialogOpen(false);
        setSelectedChapter(null);  // Reset selected chapter
    };

    const fetchEntryContent = async (entryId) => {
        if (!user?.token) return null

        try {
            const response = await fetch(`/api/entries/${entryId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            })

            const json = await response.json()
            if (json.success && json.data) {
                return {
                    content: json.data.content,
                    createdAt: json.data.createdAt
                }
            }
        } catch (error) {
            console.error("Failed to fetch entry:", error)
        }

        return null
    }

    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "Anonymous"
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = url
        })
    }

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
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <SidebarMenuButton>
                                            <FolderOutput /><span className="text-base ml-2">Export</span>
                                        </SidebarMenuButton>
                                    </DialogTrigger>
                                    <DialogContent className="!rounded-xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold mb-2 font-gotu tracking-[0.4px]">Export Chapter</DialogTitle>
                                            <p>Select a chapter to export as a PDF.</p>
                                        </DialogHeader>
                                        {!loading && (
                                            <div className="relative mb-0">
                                                <Select onValueChange={async (id) => {
                                                    if (!user?.token) return

                                                    const chapterData = await getChapterById(id, user)
                                                    if (chapterData) {
                                                        setSelectedChapter(chapterData)
                                                    }
                                                }}>
                                                    <SelectTrigger className="max-w-[300px]">
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
                                            <Button onClick={handleExport} disabled={!selectedChapter}>
                                                Export as PDF
                                            </Button>
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
                                        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
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
