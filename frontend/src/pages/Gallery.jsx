import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


const Gallery = () => {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [media, setMedia] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch media data (image URLs) from the server
    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/entries', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                const allMedia = data.data.map(entry => entry.media).flat();
                setMedia(allMedia);
            } else {
                toast({ variant: 'destructive', description: 'Failed to load media', duration: 1200 });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', description: 'Failed to load media', duration: 1200 });
        }
    };

    useEffect(() => {
        if (user) {
            fetchMedia();
        }
    }, [user]);

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {media.length === 0 ? (
                            <p>No media available</p>
                        ) : (
                            media.map((url, index) => (
                                <Dialog key={index} className="mb-0">
                                    <DialogTrigger asChild>
                                        <img src={url} alt={`media-${index}`} onClick={() => setSelectedImage(url)} />
                                    </DialogTrigger>
                                    <DialogContent className="p-0">
                                        {selectedImage && (
                                            <img src={selectedImage} alt="Preview" className="w-full h-auto" />
                                        )}
                                    </DialogContent>
                                </Dialog>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
