import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useEntryStore } from '../store/entry';
import EntryCard from '../components/EntryCard';
import { useAuthContext } from '@/hooks/useAuthContext';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import 'react-quill/dist/quill.snow.css';

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
    <div className='flex'>
      <Navbar className='z-50' />
      <div className='-ml-7 w-full'>
        <Header />
        <div className="max-w-[800px] mx-auto">
          {entries.map((entry) => (
            <EntryCard key={entry._id} entry={entry} />
          ))}

          {entries.length === 0 && (<p>No entries yet. <Link to={"/journal"}><span className='text-yellow-300'>Create one today</span></Link></p>)}

        </div>
      </div>
    </div>
  )
}

export default Dashboard