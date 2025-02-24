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
        // Navigate to JournalPage and pass the entry data using state
        navigate('/journal', { state: { entry } });
    };
    const { deleteEntry } = useEntryStore();

    const handleDeleteEntry = async (eid) => {
        if (user) {
            const { success, message } = await deleteEntry(eid, user); // Pass the user to deleteEntry
            if (success) {
                toast({ description: 'Entry deleted successfully' });
            } else {
                toast({ variant: "destructive", description: message || 'Error deleting entry' });
            }
        }
    }
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardDescription>{entry.createdAt}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Render the content with innerHTML */}
                <div className='ql-snow'>
                    <div className="ql-editor" dangerouslySetInnerHTML={{ __html: generateExcerpt(entry.content) }} />
                </div>
            </CardContent>
            <CardFooter>
                <Pencil className='mr-5' onClick={() => handleEditEntry(entry._id)} />
                <Trash2 onClick={() => handleDeleteEntry(entry._id)} />
            </CardFooter>
        </Card>
    )
}

export default EntryCard