import React, { useRef, useEffect, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEntryStore } from '../store/entry';
import { useChapterStore } from "@/store/chapter";
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ChapterDropdown = ({ selectedChapter, onChapterChange, chapters }) => {
    return (
        <Select value={selectedChapter} onValueChange={onChapterChange}>
            <SelectTrigger id="chapter-select" className="max-w-[200px] absolute mt-[15px] right-5">
                <SelectValue placeholder="Choose a chapter" />
            </SelectTrigger>
            <SelectContent>
                {chapters.map((chapter) => (
                    <SelectItem key={chapter._id} value={chapter._id}>
                        {chapter.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const JournalPage = () => {
    const { toast } = useToast();
    const { user } = useAuthContext();
    const { createEntry, updateEntry } = useEntryStore();
    const { chapters } = useChapterStore();
    const navigate = useNavigate();
    const location = useLocation();
    const entry = location.state?.entry;

    // Using ref for the ReactQuill instance
    const reactQuillRef = useRef(null);

    // Define state for the selected chapter
    const [selectedChapter, setSelectedChapter] = useState('');

    // Load entry content and set the selected chapter when editing an entry
    useEffect(() => {
        if (entry) {
            setSelectedChapter(entry.chapter?._id || ''); // Set the selected chapter if exists
            if (reactQuillRef.current) {
                const editor = reactQuillRef.current.getEditor();
                editor.clipboard.dangerouslyPasteHTML(entry.content);
            }
        }
    }, [entry]);

    // Handle chapter selection change
    const handleChapterChange = (chapterId) => {
        setSelectedChapter(chapterId);
    };

    // Function to handle image uploads
    const handleImageUpload = async () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "gingerdiary_user_uploads");

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/df82gzofs/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }

                const imageUrl = data.secure_url;

                // Insert the image into Quill editor without re-rendering
                const editor = reactQuillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", imageUrl);

            } catch (error) {
                console.error("Image upload failed:", error);
                toast({ variant: "destructive", description: "Image upload failed", duration: 1200 });
            }
        };
    };

    // Function to handle save new entry or update existing entry
    const handleSaveEntry = async () => {
        if (!user) return;

        // Get content from Quill editor
        const editor = reactQuillRef.current.getEditor();
        const entryContent = editor.root.innerHTML;

        // Extract image URLs from entryContent
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = entryContent;
        const imageUrls = Array.from(tempDiv.getElementsByTagName("img")).map(img => img.src);

        if (entry) {
            // Update existing entry
            const updatedData = { ...entry, content: entryContent, media: imageUrls, chapter: selectedChapter || null };
            const { success } = await updateEntry(updatedData, user);

            if (success) {
                toast({ description: "Entry updated successfully", duration: 1200 });
                navigate('/');
            } else {
                toast({ variant: "destructive", description: "There was an error updating your entry", duration: 1200 });
            }
        } else {
            // Create new entry
            const newEntry = { content: entryContent, media: imageUrls, chapter: selectedChapter || null };
            const { success } = await createEntry(newEntry, user);

            if (success) {
                toast({ description: "Entry created successfully", duration: 1200 });
                navigate('/');
            } else {
                toast({ variant: "destructive", description: "There was an error creating your entry", duration: 1200 });
            }
        }
    };

    // Use `useMemo` to prevent Quill editor from re-rendering when `selectedChapter` changes
    const quillEditor = useMemo(() => (
        <ReactQuill
            ref={reactQuillRef}
            theme="snow"
            placeholder="Start writing..."
            onChange={() => { }} // No need to track state here
            modules={{
                toolbar: {
                    container: [
                        [{ header: "1" }, { header: "2" }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                        ["link", "image", "video"],
                        ["clean"],
                    ],
                    handlers: {
                        image: handleImageUpload, // Custom handler for image uploads
                    },
                },
                clipboard: { matchVisual: false },
            }}
            formats={[
                "header", "size", "bold", "italic", "underline", "strike",
                "blockquote", "list", "bullet", "indent", "link", "image", "video",
            ]}
        />
    ), []); // Empty dependency array ensures Quill is created only once

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />

                {/* Chapter selection dropdown (re-renders only when necessary) */}
                <ChapterDropdown
                    selectedChapter={selectedChapter}
                    onChapterChange={handleChapterChange}
                    chapters={chapters}
                />

                <div className="">
                    {/* Memoized Quill Editor to prevent re-renders */}
                    {quillEditor}

                    <Button className="fixed bottom-5 right-5 px-4 py-2" onClick={handleSaveEntry}>
                        <Check />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default JournalPage;
