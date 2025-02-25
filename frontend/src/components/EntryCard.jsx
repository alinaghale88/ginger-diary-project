import React from 'react'
import { useEntryStore } from '../store/entry'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Pencil, Trash2 } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

// Helper function to generate excerpt
const generateExcerpt = (content, maxLength = 250) => {
    if (!content) return "";
    const plainTextContent = content.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
    return plainTextContent.length > maxLength
        ? content.substring(0, maxLength) + "..."
        : content;
};

const EntryCard = ({ entry }) => {
    const { toast } = useToast();

    const { user } = useAuthContext(); // Get the current user

    const navigate = useNavigate();

    const handleEditEntry = (entry) => {
        // Navigate to JournalPage and pass full entry object using state
        navigate('/journal', { state: { entry } });
    };
    const { deleteEntry } = useEntryStore();

    const handleDeleteEntry = async (eid) => {
        if (user) {
            const { success, message } = await deleteEntry(eid, user); // Pass the user to deleteEntry
            if (success) {
                toast({ description: 'Entry deleted successfully', duration: 1200 });
            } else {
                toast({ variant: "destructive", description: message || 'Error deleting entry', duration: 1200 });
            }
        }
    }
    // Format the timestamp to a readable date
    const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-CA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        <Card className="shadow-lg">
            <CardHeader className="pb-3 mb-0">
                <CardDescription className="mb-0 italic">{formattedDate}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0 flex gap-10 mb-0">
                {/* Render the content with innerHTML */}
                <div className='ql-snow mb-7'>
                    <div className="ql-editor !p-0 mb-0" dangerouslySetInnerHTML={{ __html: generateExcerpt(entry.content) }} />
                </div>
                <div>
                    <Pencil className='mb-1.5 w-4' onClick={() => handleEditEntry(entry)} />
                    <Trash2 className='w-4' onClick={() => handleDeleteEntry(entry._id)} />
                </div>
            </CardContent>
        </Card>
    )
}

export default EntryCard