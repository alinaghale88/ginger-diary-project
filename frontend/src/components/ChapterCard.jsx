import { Link } from "react-router-dom";

const ChapterCard = ({ chapter }) => {
    return (
        <Link to={`/chapter/${chapter._id}`} key={chapter._id}>
            <div className="chapter-card">
                <img src={chapter.coverImage} alt={chapter.name} />
                <h3>{chapter.name}</h3>
            </div>
        </Link>
    );
};

export default ChapterCard;
