import React from 'react'
import { useState } from 'react'

const JournalPage = () => {
    const [newEntry, setNewEntry] = useState({
        title: "",
        content: ""
    });

    const handleAddEntry = () => {
        console.log(newEntry);
    }
    return (
        <div>

            <div>
                <input type="text" name="title" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} />
            </div>
            <div>
                <textarea name="content" value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} />
            </div>
            <div><button type="submit" onClick={handleAddEntry}>Save Entry</button></div>

        </div>
    )
}

export default JournalPage