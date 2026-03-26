import { forwardRef } from "react";

const PlaceholderGradient = () => (
  <div className="w-full h-full bg-gradient-to-br from-emerald-700 via-green-600 to-teal-500 flex items-center justify-center">
    <span className="text-5xl opacity-70 select-none">🚲</span>
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const BlogCard = forwardRef(
  (
    {
      postId,
      postNumber,
      iframeUrl,
      selected,
      mainHeader,
      subHeader,
      thumbnailUrl,
      createdAt,
      onSelection,
    },
    ref
  ) => {
    const handleSelection = (e) => {
      onSelection(e, postId, iframeUrl);
    };

    const hasThumbnail = thumbnailUrl && thumbnailUrl.trim() !== "";
    const formattedDate = formatDate(createdAt);

    return (
      <div ref={ref} className="w-full px-5 py-1.5">
        <article
          className={`bamboo-card cursor-pointer ${selected ? "selected" : ""}`}
          onClick={handleSelection}
        >
          {/* Full-width image on top */}
          <div className="relative w-full h-40 overflow-hidden">
            {hasThumbnail ? (
              <>
                <img
                  alt=""
                  src={thumbnailUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </>
            ) : (
              <PlaceholderGradient />
            )}
            {/* Post number badge */}
            {postNumber && (
              <span className="absolute top-2 left-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shadow-md"
                style={{ background: 'var(--bamboo-tan)', color: 'var(--jungle-deep)' }}>
                {postNumber}
              </span>
            )}
          </div>

          {/* Content below image */}
          <div className="px-3 py-2.5">
            {formattedDate && (
              <time className="text-[11px] font-medium" style={{ color: 'var(--moss)' }}>
                {formattedDate}
              </time>
            )}
            <h3 className="text-sm font-semibold leading-tight mt-0.5" style={{ color: 'var(--jungle-deep)' }}>
              {mainHeader}
            </h3>
            {subHeader && (
              <p className="mt-0.5 text-xs leading-snug text-gray-500 line-clamp-2">
                {subHeader}
              </p>
            )}
          </div>
        </article>
      </div>
    );
  }
);

export default BlogCard;
