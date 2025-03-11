import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEntryStore } from "@/store/entry";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

const ViewEntry = () => {
    const { deleteEntry } = useEntryStore();
    const { toast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const entry = location.state?.entry; // Get entry from navigation state
    const { user } = useAuthContext();

    if (!entry) {
        return <p className="text-center text-red-500">Entry not found</p>;
    }

    const handleDeleteEntry = async (eid) => {
        if (user) {
            const { success, message } = await deleteEntry(eid, user); // Pass the user to deleteEntry
            if (success) {
                toast({ description: 'Entry deleted successfully', duration: 1200 });
                navigate('/');
            } else {
                toast({ variant: "destructive", description: message || 'Error deleting entry', duration: 1200 });
            }
        }
    }

    return (
        <div className="flex">
            <Navbar className="z-50" />
            <div className="-ml-7 w-full">
                <Header />
                {/* Edit Button */}
                <div className="flex justify-between border-b-2 border-black/5 px-6">
                    <div>
                        <ArrowLeft className="w-4 inline-block" onClick={() => navigate('/')} />
                        <p className="italic text-gray-500 inline-block ml-[20px]">{new Date(entry.createdAt).toLocaleDateString('en-CA', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}</p>
                    </div>
                    <div>
                        <Pencil className="w-4 inline-block" onClick={() => navigate('/journal', { state: { entry } })} />
                        <Trash2 className='w-4 inline-block ml-[20px]' onClick={() => handleDeleteEntry(entry._id)} />
                    </div>
                </div>
                <div className="max-w-4xl m-auto p-6 rounded-lg shadow-lg">

                    <div className="ql-snow mt-4">
                        <div className="ql-editor !p-0" dangerouslySetInnerHTML={{ __html: entry.content }} />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ViewEntry;
