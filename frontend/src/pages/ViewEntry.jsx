import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEntryStore } from "@/store/entry";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const ViewEntry = () => {
    const { deleteEntry } = useEntryStore();
    const { toast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const entry = location.state?.entry;
    const { user } = useAuthContext();

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

    if (!entry) {
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
                            {new Date(entry.createdAt).toLocaleDateString('en-CA', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="my-[20px] flex items-center space-x-4">
                        <Pencil className="w-5 cursor-pointer" onClick={() => navigate('/journal', { state: { entry } })} />
                        <Trash2 className='w-5 cursor-pointer' onClick={() => handleDeleteEntry(entry._id)} />
                    </div>
                </div>

                <div className="max-w-4xl m-auto p-6">
                    <div className="ql-snow">
                        <div className="ql-editor !p-0 !leading-relaxed !tracking-[0.4px]" dangerouslySetInnerHTML={{ __html: entry.content }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEntry;
