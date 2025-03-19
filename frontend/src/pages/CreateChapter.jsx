import React, { useState, useEffect } from 'react';
import { useChapterStore } from '../store/chapter';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import UploadImage from '@/components/UploadImage';

const CreateChapter = () => {
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const { user } = useAuthContext();
    const { id } = useParams(); // Get the chapter ID from the URL
    const { getChapterById, createChapter, updateChapter } = useChapterStore();
    const navigate = useNavigate();

    // Fetch chapter data if editing an existing chapter
    useEffect(() => {
        if (id) {
            const fetchChapterData = async () => {
                const chapterData = await getChapterById(id, user);
                if (chapterData) {
                    setName(chapterData.name);
                    setDescription(chapterData.description);
                    setCoverImage(chapterData.coverImage); // Set the current image URL for editing
                }
            };
            fetchChapterData();
        }
    }, [id, user, getChapterById]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            toast({ variant: "destructive", description: "Please enter all fields", duration: 1200 });
            return;
        }

        const chapterData = { name, description, coverImage };

        if (id) {
            // Update existing chapter if ID exists
            const result = await updateChapter(id, chapterData, user);
            if (result.success) {
                toast({ description: "Chapter updated successfully", duration: 1200 });
                navigate('/');
            } else {
                toast({ variant: "destructive", description: "There was an error updating your chapter", duration: 1200 });
            }
        } else {
            // Create new chapter if no ID
            const result = await createChapter(chapterData, user);
            if (result.success) {
                toast({ description: "Chapter created successfully", duration: 1200 });
                navigate('/');
            } else {
                toast({ variant: "destructive", description: "There was an error creating your chapter", duration: 1200 });
            }
        }
    };

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="max-w-[700px] mx-auto mt-7 px-6">
                    <input
                        type="text"
                        placeholder="Chapter Name"
                        value={name} className='mb-4'
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {/* Pass the initial cover image URL if available */}
                    <UploadImage
                        onUpload={setCoverImage}
                        initialImage={coverImage} // Pass the current cover image URL here
                    />
                    {/* Change button text based on if you're editing or creating */}
                    <Button onClick={handleSubmit}>
                        {id ? "Update Chapter" : "Add Chapter"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CreateChapter;
