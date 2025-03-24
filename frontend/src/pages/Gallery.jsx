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
    const [media, setMedia] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/entries/media', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setMedia(data.media); // Now, media is an object grouped by month and year
            } else {
                toast({ variant: 'destructive', description: 'Failed to load media', duration: 1200 });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', description: 'Failed to load media', duration: 1200 });
        }
    };

    const formatMonthYear = (monthYear) => {
        const [year, month] = monthYear.split('-'); // Split "2025-3"
        const formattedMonth = month.padStart(2, '0'); // Ensure "3" becomes "03"
        const date = new Date(`${year}-${formattedMonth}-01`); // Create valid date

        return `${date.toLocaleString('en-US', { month: 'long' })} ${year}`;
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
                    {Object.keys(media).length === 0 ? (
                        <p>No media available</p>
                    ) : (
                        Object.keys(media).map((monthYear, index) => (
                            <div key={index} className="mb-7 mt-7">
                                <h2 className="text-xl font-bold mb-4 font-gotu tracking-[0.4px]">{formatMonthYear(monthYear)}</h2>
                                <div className="grid grid-cols-3 gap-6">
                                    {media[monthYear].map((url, idx) => (
                                        <Dialog key={idx} className="mb-0">
                                            <DialogTrigger asChild>
                                                <div className='rounded-xl p-4 border cursor-pointer'>
                                                    <img src={url} alt={`media-${idx}`} className="rounded-xl" onClick={() => setSelectedImage(url)} />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="p-0">
                                                {selectedImage && (
                                                    <img src={selectedImage} alt="Preview" className="m-auto" />
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};


export default Gallery;