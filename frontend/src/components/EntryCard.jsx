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

// import { RiDeleteBin6Line } from "react-icons/ri";


const EntryCard = ({ entry }) => {
    const { deleteEntry } = useEntryStore();

    const handleDeleteEntry = async (eid) => {
        const { success, message } = await deleteEntry(eid);
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
                <Trash2 onClick={() => handleDeleteEntry(entry._id)} />
            </CardFooter>
        </Card>
    )
}

export default EntryCard