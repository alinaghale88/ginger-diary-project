import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useEntryStore } from '../store/entry';
import EntryCard from '../components/EntryCard';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const { fetchEntries, entries } = useEntryStore();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  console.log("entries", entries);
  return (
    <div>
      <Link to={"/journal"}>
        <Button>
          <Plus /> Create Entry
        </Button>
      </Link>
      <div>
        {entries.map((entry) => (
          <EntryCard key={entry._id} entry={entry} />
        ))}
      </div>

      {entries.length === 0 && (<p>No entries yet. <Link to={"/journal"}><span className='text-yellow-300'>Create one today</span></Link></p>)}

    </div>
  )
}

export default Dashboard