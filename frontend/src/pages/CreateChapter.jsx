// CreateChapter.js
import React, { useState } from 'react';
import { useChapterStore } from '../store/chapter';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const CreateChapter = () => {
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const { user } = useAuthContext();
    const { createChapter } = useChapterStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    <input
                        type="text"
                        placeholder="Cover Image URL"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                    />
                    <Button onClick={handleSubmit}>Add Category</Button>
                </div>
            </div>
        </div>
    );
}

export default CreateChapter;
