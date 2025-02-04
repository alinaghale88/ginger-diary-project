import React from 'react'
import { useState } from 'react'
import { useEntryStore } from '../store/entry';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
            <ReactQuill theme="snow" value={newEntry.content} onChange={(content) => setNewEntry({ ...newEntry, content })} />
            <button type="submit" onClick={handleAddEntry}>Save Entry</button>

        </div >
    )
}

export default JournalPage