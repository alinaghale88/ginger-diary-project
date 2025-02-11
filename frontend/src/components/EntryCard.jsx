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

// import { RiDeleteBin6Line } from "react-icons/ri";


const EntryCard = ({ entry }) => {
    const { user } = useAuthContext(); // Get the current user

    const { deleteEntry } = useEntryStore();

    const handleDeleteEntry = async (eid) => {
        if (user) {
            const { success, message } = await deleteEntry(eid, user); // Pass the user to deleteEntry
            if (success) {
                alert('Entry deleted successfully');
            } else {
                alert(message || 'Error deleting entry');
            }
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{entry.title}</CardTitle>
                <CardDescription>{entry.createdAt}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{entry.content}</p>
            </CardContent>
            <CardFooter>
                #Tags<Trash2 onClick={() => handleDeleteEntry(entry._id)} />
            </CardFooter>
        </Card>
    )
}

export default EntryCard