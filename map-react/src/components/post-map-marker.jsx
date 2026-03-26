const PostMapMarker = ({ className, onClick, index, thumbnailUrl }) => {
  const hasThumbnail = thumbnailUrl && thumbnailUrl.trim() !== "";

  return (
    <div
      className={className}
      onClick={() => {
        onClick(index);
      }}
    >
      <div className="photo-marker">
        {hasThumbnail ? (
          <img
            src={thumbnailUrl}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className="emoji-fallback">🚲</span>
        )}
      </div>
    </div>
  );
};

export default PostMapMarker;
