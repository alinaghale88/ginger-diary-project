import { Link } from "react-router-dom";

const ChapterCard = ({ chapter }) => {
    return (
        <Link to={`/chapter/${chapter._id}`} key={chapter._id}>
            <div className="chapter-card h-[220px]">
                <img src={chapter.coverImage} alt={chapter.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <h3 className="text-base font-semibold mb-1 font-gotu">{chapter.name}</h3>

        </Link>
    );
};

export default ChapterCard;
