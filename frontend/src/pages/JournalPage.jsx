import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEntryStore } from '../store/entry';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const JournalPage = () => {
    const { toast } = useToast();
    const { user } = useAuthContext();
    const { createEntry } = useEntryStore();
    const navigate = useNavigate();

    // Using ref for the ReactQuill instance
    const reactQuillRef = useRef(null);

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
                toast({ variant: "destructive", description: "Image upload failed" });
            }
        };
    };

    // Function to handle adding new entry
    const handleAddEntry = async () => {
        if (!user) return;

        // Get content from Quill editor (using ref)
        const editor = reactQuillRef.current.getEditor();
        const entryContent = editor.root.innerHTML;

        if (!entryContent.trim()) {
            toast({ variant: "destructive", description: "Content cannot be empty" });
            return;
        }

        // Create the entry with only content
        const newEntry = { content: entryContent };

        const { success } = await createEntry(newEntry, user);

        if (success) {
            toast({ description: "Entry created successfully" });
            navigate('/')
        } else {
            toast({ variant: "destructive", description: "There was an error creating your entry" });
        }

        // Clear the content after submission
        editor.setText("");  // Clear the editor content directly
    };

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="max-w-4xl m-auto">
                    {/* ReactQuill without value binding to state */}
                    <ReactQuill
                        ref={reactQuillRef}
                        theme="snow" className="h-[400px]"
                        placeholder="Start writing..."
                        onChange={() => { }} // No need to track state here
                        modules={{
                            toolbar: {
                                container: [
                                    [{ header: "1" }, { header: "2" }, { font: [] }],
                                    [{ size: [] }],
                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                    ["link", "image", "video"],
                                    ["code-block"],
                                    ["clean"],
                                ],
                                handlers: {
                                    image: handleImageUpload, // Custom handler for image uploads
                                },
                            },
                            clipboard: { matchVisual: false },
                        }}
                        formats={[
                            "header", "font", "size", "bold", "italic", "underline", "strike",
                            "blockquote", "list", "bullet", "indent", "link", "image", "video", "code-block",
                        ]}
                    />
                    <Button className="mt-[70px]" onClick={handleAddEntry}>Save Entry</Button>
                </div>
            </div>
        </div>
    );
};

export default JournalPage;
