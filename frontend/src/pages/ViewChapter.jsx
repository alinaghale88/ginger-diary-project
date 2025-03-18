import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useChapterStore } from "../store/chapter";
import { useEntryStore } from "../store/entry";
import { useAuthContext } from "@/hooks/useAuthContext";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import EntryCard from "@/components/EntryCard";

const ViewChapter = () => {
    const { id } = useParams();
    const { user } = useAuthContext(); // Get user info
    const { getChapterById } = useChapterStore();
    const { fetchEntriesByChapter, entries } = useEntryStore();
    const [chapter, setChapter] = useState(null);

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

    if (!chapter) return <p>Loading...</p>;

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="max-w-6xl mx-auto px-4 mt-7 flex flex-wrap flex-row">
                    {/* Chapter Details */}
                    <h2 className="text-xl font-bold mb-5 font-gotu tracking-[0.4px] w-full">Chapter: {chapter.name}</h2>
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
        </div >
    );
};

export default ViewChapter;
