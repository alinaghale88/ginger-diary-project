import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useEntryStore } from '../store/entry';
import EntryCard from '../components/EntryCard';
import { useAuthContext } from '@/hooks/useAuthContext';

const Dashboard = () => {
  const { fetchEntries, entries } = useEntryStore();
  const { user } = useAuthContext()

  useEffect(() => {
    if (user) {
      fetchEntries(user);
    }
  }, [fetchEntries, user]);
  console.log("entries", entries);
  return (
    <div className="max-w-[800px] mx-auto">
      {entries.map((entry) => (
        <EntryCard key={entry._id} entry={entry} />
      ))}

      {entries.length === 0 && (<p>No entries yet. <Link to={"/journal"}><span className='text-yellow-300'>Create one today</span></Link></p>)}

    </div>
  )
}

export default Dashboard