import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

const Gallery = () => {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [media, setMedia] = useState([]);

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
                <div>
                    <h1 className="text-2xl font-bold">Gallery</h1>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {media.length === 0 ? (
                            <p>No media available</p>
                        ) : (
                            media.map((url, index) => (
                                <div key={index} className="relative">
                                    <img src={url} alt={`media-${index}`} className="w-full h-auto object-cover" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
