import React, { useRef } from 'react'
import { useState } from 'react'
import { useEntryStore } from '../store/entry';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthContext } from '@/hooks/useAuthContext';

const JournalPage = () => {
    const [newEntry, setNewEntry] = useState({
        title: "",
        content: ""
    });

    const { user } = useAuthContext()

    const reactQuillRef = useRef(null);

    const { createEntry } = useEntryStore();

    const handleAddEntry = async () => {
        if (!user) {
            return;
        }
        const { success, message } = await createEntry(newEntry, user)
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
            <ReactQuill
                ref={reactQuillRef}
                theme="snow"
                placeholder="Start writing..."
                modules={{
                    toolbar: {
                        container: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
                            [{ size: [] }],
                            ["bold", "italic", "underline", "strike", "blockquote"],
                            [
                                { list: "ordered" },
                                { list: "bullet" },
                                { indent: "-1" },
                                { indent: "+1" },
                            ],
                            ["link", "image", "video"],
                            ["code-block"],
                            ["clean"],
                        ],
                    },
                    clipboard: {
                        matchVisual: false,
                    },
                }}
                formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                    "code-block",
                ]}
                value={newEntry.content}
                onChange={(content) => setNewEntry({ ...newEntry, content })}
            />
            <button type="submit" onClick={handleAddEntry}>Save Entry</button>
        </div >
    )
}

export default JournalPage