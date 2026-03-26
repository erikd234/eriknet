const QuestMarkerIcon = ({ number }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Golden quest marker shape */}
    <path d="M14 2L18 8L26 10L20 16L21 24L14 20L7 24L8 16L2 10L10 8Z"
          fill="url(#goldGrad)" stroke="#5a4430" strokeWidth="1"/>
    <defs>
      <linearGradient id="goldGrad" x1="2" y1="2" x2="26" y2="26">
        <stop offset="0%" stopColor="#e8c840"/>
        <stop offset="50%" stopColor="#c8a850"/>
        <stop offset="100%" stopColor="#9a7a30"/>
      </linearGradient>
    </defs>
  </svg>
);

const PostMapMarker = ({ className, onClick, index, thumbnailUrl }) => {
  const hasThumbnail = thumbnailUrl && thumbnailUrl.trim() !== "";

  return (
    <div
      className={className}
      onClick={() => {
        onClick(index);
      }}
    >
      {hasThumbnail ? (
        <div className="photo-marker">
          <img
            src={thumbnailUrl}
            alt=""
            loading="lazy"
          />
        </div>
      ) : (
        <div className="quest-marker">
          <QuestMarkerIcon number={index + 1} />
        </div>
      )}
    </div>
  );
};

export default PostMapMarker;
