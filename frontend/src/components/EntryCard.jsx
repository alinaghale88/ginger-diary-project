import React from 'react'
import { useEntryStore } from '../store/entry'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

// Helper function to generate excerpt
const generateExcerpt = (content, maxLength = 210) => {
    if (!content) return "";
    const plainTextContent = content.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
    return plainTextContent.length > maxLength
        ? content.substring(0, maxLength) + "..."
        : content;
};

const EntryCard = ({ entry }) => {
    const { toast } = useToast();

    const { user } = useAuthContext(); // Get the current user

    const navigate = useNavigate();

    // Format the timestamp to a readable date
    const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-CA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        <Card className="shadow-lg cursor-pointer mt-8" onClick={() => navigate(`/view-entry/${entry._id}`, { state: { entry } })}>
            <CardHeader className="pb-3 px-10 mb-0 flex flex-row flex-wrap justify-between items-center">
                <CardDescription className="mb-0 font-gotu tracking-[0.4px]">{formattedDate}</CardDescription>
                {entry.chapter && (
                    <Badge className="!mt-0 tracking-wider" onClick={(e) => {
                        e.stopPropagation(); // Prevent entry card click from triggering
                        navigate(`/chapter/${entry.chapter._id}`, { state: { chapter: entry.chapter } });
                    }}>
                        {entry.chapter.name}
                    </Badge>
                )}
                <Separator className="!mt-[14px] w-full" />
            </CardHeader>
            <CardContent className="pb-0 mb-0 px-10">
                {/* Render the content with innerHTML */}
                <div className='ql-snow mb-7'>
                    <div className="ql-editor !p-0 mb-0 !leading-relaxed !tracking-[0.4px]">{entry.excerpt}</div>
                </div>
            </CardContent>
        </Card>
    )
}

export default EntryCard