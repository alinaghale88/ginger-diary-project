import React, { useEffect } from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { useEntryStore } from '../store/entry';
import EntryCard from '../components/EntryCard';

const Dashboard = () => {
  const { fetchEntries, entries } = useEntryStore();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  console.log("entries", entries);
  return (
    <div>
      <div>
        <Link to={"/journal"}><CiSquarePlus className='text-[40px]' /></Link>
      </div>
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