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
                fetchEntriesByChapter(id, user);
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
                <div className="max-w-[700px] mx-auto mt-7">
                    {/* Chapter Details */}
                    <div className="mb-5">
                        {chapter.coverImage && (
                            <img src={chapter.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
                        )}
                        <h1 className="text-2xl font-bold mt-3">{chapter.name}</h1>
                        <p className="text-gray-500">{chapter.description}</p>
                    </div>

                    {/* List of Entries */}
                    <h2 className="text-xl font-semibold mt-5">Entries</h2>
                    {entries.length > 0 ? (
                        <div className="grid gap-4">
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
    );
};

export default ViewChapter;
