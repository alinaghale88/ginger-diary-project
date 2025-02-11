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
import { Trash2 } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';

const EntryCard = ({ entry }) => {
    const { toast } = useToast();

    const { user } = useAuthContext(); // Get the current user

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
                <div dangerouslySetInnerHTML={{ __html: entry.content }} />
            </CardContent>
            <CardFooter>
                <Trash2 onClick={() => handleDeleteEntry(entry._id)} />
            </CardFooter>
        </Card>
    )
}

export default EntryCard