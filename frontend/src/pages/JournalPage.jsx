import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEntryStore } from '../store/entry';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const JournalPage = () => {
    const { toast } = useToast();
    const { user } = useAuthContext();
    const { createEntry, updateEntry } = useEntryStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Using ref for the ReactQuill instance
    const reactQuillRef = useRef(null);

    const updatedEntry = location.state?.entry; // Retrieve the passed entry data

    // Define state for the entry content
    const [entryContent, setEntryContent] = useState('');

    useEffect(() => {
        if (updatedEntry && reactQuillRef.current) {
            const editor = reactQuillRef.current.getEditor();
            editor.clipboard.dangerouslyPasteHTML(updatedEntry.content); // Set content for editing
        }
    }, [updatedEntry]);

    // Function to handle image uploads and insert them into the editor
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

                // Directly update the Quill editor without causing re-render
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

        // Get content from Quill editor (using ref)
        const editor = reactQuillRef.current.getEditor();
        const entryContent = editor.root.innerHTML;

        // Extract image URLs from entryContent
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = entryContent;
        const imageUrls = Array.from(tempDiv.getElementsByTagName("img")).map(img => img.src);

        if (updatedEntry) {
            // Update existing entry
            const updatedData = { ...updatedEntry, content: entryContent, media: imageUrls }; // Save images in media
            const { success } = await updateEntry(updatedData, user);

            if (success) {
                toast({ description: "Entry updated successfully", duration: 1200 });
                navigate('/');
            } else {
                toast({ variant: "destructive", description: "There was an error updating your entry", duration: 1200 });
            }
        } else {

            // Create the entry with only content
            const newEntry = { content: entryContent, media: imageUrls }; // Save images in media

            const { success } = await createEntry(newEntry, user);

            if (success) {
                toast({ description: "Entry created successfully", duration: 1200 });
                navigate('/')
            } else {
                toast({ variant: "destructive", description: "There was an error creating your entry", duration: 1200 });
            }
        }

        // Clear the content after submission
        setEntryContent(''); // Update state to clear content

    };

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="">
                    {/* ReactQuill without value binding to state */}
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
                    <Button className="fixed bottom-5 right-5 px-4 py-2 " onClick={handleSaveEntry}><Check /></Button>
                </div>
            </div>
        </div>
    );
};

export default JournalPage;
