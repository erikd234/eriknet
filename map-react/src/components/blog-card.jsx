import { forwardRef } from "react";

const PlaceholderGradient = ({ postNumber }) => (
  <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300 flex items-center justify-center">
    <span className="text-4xl opacity-60 select-none">🚲</span>
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
      <div
        ref={ref}
        className={`
          w-full px-4 py-2
        `}
      >
        <article
          className={`
            relative flex gap-4 p-3 rounded-xl cursor-pointer
            bg-white shadow-sm
            transition-all duration-200 ease-out
            hover:shadow-md hover:-translate-y-0.5
            ${selected ? "border-l-4 border-l-amber-500 shadow-md" : "border-l-4 border-l-transparent"}
          `}
          onClick={handleSelection}
        >
          {/* Thumbnail */}
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
            {hasThumbnail ? (
              <>
                <img
                  alt=""
                  src={thumbnailUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </>
            ) : (
              <PlaceholderGradient postNumber={postNumber} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              {postNumber && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold shrink-0">
                  {postNumber}
                </span>
              )}
              {formattedDate && (
                <time className="text-[11px] text-gray-400 font-medium">
                  {formattedDate}
                </time>
              )}
            </div>
            <h3 className="text-sm font-semibold leading-tight text-gray-900 truncate">
              {mainHeader}
            </h3>
            {subHeader && (
              <p className="mt-0.5 text-xs leading-snug text-gray-500 truncate">
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
