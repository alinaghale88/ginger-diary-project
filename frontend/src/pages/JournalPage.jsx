import React from 'react'
import { useState } from 'react'
import { useEntryStore } from '../store/entry';

const JournalPage = () => {
    const [newEntry, setNewEntry] = useState({
        title: "",
        content: ""
    });

    const { createEntry } = useEntryStore();

    const handleAddEntry = async () => {
        const { success, message } = await createEntry(newEntry)
        if (success) {
            alert("Entry created successfully");
        }
        else {
            alert("Please fill in all the fields")
        }
        setNewEntry({ title: "", content: "" });
    }

    return (
        <div className='max-w-4xl m-auto'>

            <div>
                <input type="text" name="title" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} />
            </div>
            <div>
                <textarea name="content" value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} />
            </div>
            <button type="submit" onClick={handleAddEntry}>Save Entry</button>

        </div >
    )
}

export default JournalPage