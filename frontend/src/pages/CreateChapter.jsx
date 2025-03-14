// CreateChapter.js
import React, { useState } from 'react';
import { useChapterStore } from '../store/chapter';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
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
    const { createChapter } = useChapterStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            toast({ variant: "destructive", description: "Please enter all fields", duration: 1200 });
            return;
        }

        const result = await createChapter({ name, description, coverImage }, user);
        if (result.success) {
            toast({ description: "Chapter created successfully", duration: 1200 });
            navigate('/');
        } else {
            toast({ variant: "destructive", description: "There was an error creating your chapter", duration: 1200 });
        }
    };

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="max-w-[700px] mx-auto mt-7">
                    <input
                        type="text"
                        placeholder="Chapter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <UploadImage onUpload={setCoverImage} />
                    <Button onClick={handleSubmit}>Add Category</Button>
                </div>
            </div>
        </div>
    );
}

export default CreateChapter;
