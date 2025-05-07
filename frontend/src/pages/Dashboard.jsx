import React, { useEffect } from 'react'
import Autoplay from "embla-carousel-autoplay";
import { Link } from 'react-router-dom';
import { useEntryStore } from '../store/entry';
import { useChapterStore } from '../store/chapter';
import EntryCard from '../components/EntryCard';
import ChapterCard from '../components/ChapterCard';
import { useAuthContext } from '@/hooks/useAuthContext';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import 'react-quill/dist/quill.snow.css';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const Dashboard = () => {
  const { fetchEntries, entries } = useEntryStore();
  const { fetchChapters, chapters } = useChapterStore();
  const { user } = useAuthContext()

  useEffect(() => {
    if (user) {
      fetchEntries(user);
      fetchChapters(user);
    }
  }, [fetchEntries, fetchChapters, user]);

  // Sort entries in reverse chronological order
  const sortedEntries = entries && entries.length
    ? [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className='flex'>
      <Navbar className='z-50' />
      <div className='-ml-7 w-full'>
        <Header />
        <div className="max-w-6xl mx-auto px-4 mt-7 slider">
          <h2 className='text-xl font-bold mb-4 font-gotu tracking-[0.4px]'>Chapters</h2>
          {chapters && chapters.length ? (
            <Carousel className="w-full mb-0" plugins={[plugin.current]} loop
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}>
              <CarouselContent className="mb-0">
                {chapters.map((chapter) => (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={chapter._id}>
                    <div className="p-4 rounded-xl border">
                      <ChapterCard chapter={chapter} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <p className='mb-10'>No chapters available. <Link to="/create-chapter"><span className='text-yellow-300'>Create one now</span></Link></p>
          )}
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className='text-xl font-bold font-gotu tracking-[0.4px]'>Entries</h2>
          <div className="max-w-[700px] mx-auto">
            {sortedEntries.map((entry) => (
              <EntryCard key={entry._id} entry={entry} />
            ))}

            {sortedEntries.length === 0 && (<p>No entries yet. <Link to={"/journal"}><span className='text-yellow-300'>Create one today</span></Link></p>)}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard