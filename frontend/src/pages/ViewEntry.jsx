import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEntryStore } from "@/store/entry";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";

const ViewEntry = () => {
    const { deleteEntry } = useEntryStore();
    const { toast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();

    const [fullEntry, setFullEntry] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (id && user) {
            fetch(`/api/entries/${id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setFullEntry(data.data);
                    } else {
                        toast({ variant: "destructive", description: "Error loading entry", duration: 1200 });
                    }
                })
                .catch(() => toast({ variant: "destructive", description: "Failed to fetch entry", duration: 1200 }))
                .finally(() => setLoading(false)); // Mark loading complete
        }
    }, [id, user, toast]);

    const handleDeleteEntry = async (eid) => {
        if (user) {
            const { success, message } = await deleteEntry(eid, user);
            if (success) {
                toast({ description: 'Entry deleted successfully', duration: 1200 });
                navigate('/');
            } else {
                toast({ variant: "destructive", description: message || 'Error deleting entry', duration: 1200 });
            }
        }
    }

    if (loading) {
        return <p className="text-center text-gray-500">Loading entry...</p>;
    }

    if (!fullEntry) {
        return <p className="text-center text-red-500">Entry not found</p>;
    }

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                <div className="flex justify-between border-b-2 border-black/5 px-6">
                    <div className="my-[20px]">
                        <ArrowLeft className="w-6 inline-block cursor-pointer" onClick={() => navigate('/')} />
                        <p className="font-gotu text-gray-500 inline-block ml-[20px]">
                            {new Date(fullEntry.createdAt).toLocaleDateString('en-CA', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="my-[20px] flex items-center space-x-5">
                        <Pencil className="w-5 cursor-pointer" onClick={() => navigate('/journal', { state: { entry: fullEntry } })} />
                        <Trash2 className='w-5 cursor-pointer' onClick={() => handleDeleteEntry(fullEntry._id)} />
                    </div>
                </div>

                <div className="max-w-[700px] mx-auto px-6 mt-7">
                    <div>
                        {fullEntry.chapter && (
                            <Badge className="!mt-0 cursor-pointer" onClick={() => {
                                navigate(`/chapter/${fullEntry.chapter._id}`, { state: { chapter: fullEntry.chapter } });
                            }}>
                                {fullEntry.chapter.name}
                            </Badge>
                        )}
                    </div>
                    <div className="ql-snow">
                        <div className="ql-editor !p-0 !leading-relaxed !tracking-[0.4px]"
                            dangerouslySetInnerHTML={{ __html: fullEntry.content }}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEntry;

