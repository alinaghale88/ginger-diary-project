import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChapterStore } from "../store/chapter";
import { useEntryStore } from "../store/entry";
import { useAuthContext } from "@/hooks/useAuthContext";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import EntryCard from "@/components/EntryCard";
import { Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ViewChapter = () => {
    const { id } = useParams();
    const { user } = useAuthContext(); // Get user info
    const { getChapterById, deleteChapter } = useChapterStore();
    const { fetchEntriesByChapter, entries } = useEntryStore();
    const [chapter, setChapter] = useState(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !user) return; // Prevent unauthorized requests
            const chapterData = await getChapterById(id, user);
            if (chapterData) {
                setChapter(chapterData);
                await fetchEntriesByChapter(id, user);
            }
        };
        fetchData();
    }, [id, user, getChapterById, fetchEntriesByChapter]);

    // Function to delete the chapter
    const handleDeleteChapter = async () => {
        const result = await deleteChapter(id, user);
        if (result.success) {
            // Navigate to the dashboard first
            navigate('/');

            // Display the toast after a slight delay
            setTimeout(() => {
                toast({ description: 'Chapter deleted successfully', duration: 1200 });
            }, 100);
        } else {
            toast({ variant: "destructive", description: "Error deleting chapter", duration: 1200 });
        }
    };

    if (!chapter) return <p>Loading...</p>;

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="flex justify-between border-b-2 border-black/5 px-6">
                    <div className="my-[20px]">
                        <ArrowLeft className="w-6 inline-block cursor-pointer" onClick={() => navigate('/')} />
                        <p className="font-gotu text-gray-500 inline-block ml-[20px]">Chapter: {chapter.name}</p>
                    </div>
                    <div className="my-[20px] flex items-center space-x-5">
                        <Pencil className="w-5 cursor-pointer" onClick={() => navigate(`/create-chapter/${id}`)} />
                        <Trash2 className="w-5 cursor-pointer" onClick={handleDeleteChapter} />
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 mt-7 flex flex-wrap flex-row">
                    {/* Chapter Details */}
                    {chapter.coverImage && (
                        <img src={chapter.coverImage} alt="Cover" className="md:basis-1/2 lg:basis-1/3 h-[220px] object-cover rounded-lg" />
                    )}

                    <p className="flex-1 pl-12 max-w-[700px]">{chapter.description}</p>
                </div>

                {/* List of Entries */}
                <div className="max-w-6xl mx-auto px-4 mt-12">
                    <h2 className="text-xl font-bold font-gotu tracking-[0.4px]">Entries</h2>
                    <div className="max-w-[700px] mx-auto">
                        {entries.length > 0 ? (
                            <div>
                                {entries.map((entry) => (
                                    <EntryCard key={entry._id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-2">No entries in this chapter yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewChapter;
