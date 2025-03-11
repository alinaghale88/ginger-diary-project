const ChapterCard = ({ chapter }) => {
    return (
        <div className="chapter-card">
            <h3>{chapter.name}</h3>
            <p>{chapter.description}</p>
            <img src={chapter.coverImage} alt={chapter.name} />
            <Link to={`/chapter/${chapter._id}`}>View Chapter</Link>
        </div>
    );
};

export default ChapterCard;
