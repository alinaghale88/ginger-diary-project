import React from 'react'
import { useEntryStore } from '../store/entry'
import { RiDeleteBin6Line } from "react-icons/ri";


const EntryCard = ({ entry }) => {
    const { deleteEntry } = useEntryStore();

    const handleDeleteEntry = async (eid) => {
        const { success, message } = await deleteEntry(eid);
    }
    return (
        <div>
            <h2 className='text-3xl'>{entry.title}</h2>
            <p>{entry.content}</p>
            <RiDeleteBin6Line onClick={() => handleDeleteEntry(entry._id)} className='text-[24px]' />
        </div>
    )
}

export default EntryCard