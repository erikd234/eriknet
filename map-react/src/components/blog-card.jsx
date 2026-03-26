import { forwardRef } from "react";

const PlaceholderGradient = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--rs-brown) 0%, var(--rs-brown-mid) 100%)' }}>
    <span className="text-4xl opacity-60 select-none">&#x2694;</span>
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

const QuestScrollIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="1" width="10" height="12" rx="1" fill="currentColor" opacity="0.3"/>
    <rect x="3" y="2" width="8" height="10" rx="0.5" stroke="currentColor" strokeWidth="0.8" fill="none"/>
    <line x1="5" y1="4.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="0.6"/>
    <line x1="5" y1="6.5" x2="9" y2="6.5" stroke="currentColor" strokeWidth="0.6"/>
    <line x1="5" y1="8.5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="0.6"/>
  </svg>
);

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
      totalPosts,
    },
    ref
  ) => {
    const handleSelection = (e) => {
      onSelection(e, postId, iframeUrl);
    };

    const hasThumbnail = thumbnailUrl && thumbnailUrl.trim() !== "";
    const formattedDate = formatDate(createdAt);

    return (
      <div ref={ref} className="w-full px-5 py-1">
        <article
          className={`quest-card cursor-pointer ${selected ? "selected" : ""}`}
          onClick={handleSelection}
        >
          <div className="flex">
            {/* Thumbnail */}
            <div className="relative w-28 min-h-[80px] flex-shrink-0 overflow-hidden">
              {hasThumbnail ? (
                <img
                  alt=""
                  src={thumbnailUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <PlaceholderGradient />
              )}
            </div>

            {/* Quest info */}
            <div className="flex-1 px-3 py-2">
              {/* Quest number and status */}
              <div className="flex items-center gap-2 mb-1">
                <span style={{
                  fontFamily: "'MedievalSharp', serif",
                  fontSize: '11px',
                  color: 'var(--rs-gold-dim)',
                }}>
                  Quest {postNumber}{totalPosts ? `/${totalPosts}` : ''}
                </span>
                <span className="quest-complete text-xs">
                  &#10003; COMPLETED
                </span>
              </div>

              {/* Quest title */}
              <h3 className="quest-title text-sm font-bold leading-tight">
                {mainHeader}
              </h3>

              {/* Subtitle / description */}
              {subHeader && (
                <p className="mt-0.5 text-xs leading-snug line-clamp-2"
                   style={{ color: 'var(--rs-brown-mid)', fontFamily: "'MedievalSharp', serif" }}>
                  {subHeader}
                </p>
              )}

              {/* Date and read more */}
              <div className="flex items-center justify-between mt-1.5">
                {formattedDate && (
                  <time className="text-[10px]" style={{ color: 'var(--rs-brown-light)', fontFamily: "'MedievalSharp', serif" }}>
                    {formattedDate}
                  </time>
                )}
                <span className="flex items-center gap-1 text-[11px]"
                      style={{ color: 'var(--rs-gold-dim)', fontFamily: "'MedievalSharp', serif" }}>
                  <QuestScrollIcon />
                  Read more...
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }
);

export default BlogCard;
