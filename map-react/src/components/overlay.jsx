import React, { forwardRef } from "react";
import BlogCard from "./blog-card";
import QuestReader from "./quest-reader";

const SwordSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20L10 14M14 10L20 4M20 4L17 4M20 4L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const Header = ({ totalPosts, completedPosts }) => (
  <div className="rs-header sticky top-0 z-10 w-full">
    <div className="flex flex-col items-center px-5 py-3">
      {/* Ornate top line */}
      <div className="flex items-center gap-3 mb-1">
        <div className="text-amber-600 opacity-60"><SwordSVG /></div>
        <h1 className="text-lg font-bold tracking-wide">
          Erik's European Bike Trip
        </h1>
        <div className="text-amber-600 opacity-60 scale-x-[-1]"><SwordSVG /></div>
      </div>
      {/* Quest subtitle */}
      <p style={{ fontFamily: "'MedievalSharp', serif", fontSize: '11px', color: 'var(--rs-text-light)', opacity: 0.7 }}>
        Quest Log — Adventures Across Europe
      </p>
    </div>
    {/* Navigation tabs */}
    <div className="flex gap-1 px-4 pb-0 -mb-px">
      <div className="rs-tab active">Quest Log</div>
      <div className="rs-tab">World Map</div>
    </div>
  </div>
);

const QuestStats = ({ totalPosts }) => (
  <div className="rs-stats-panel mx-5 mt-3 mb-2 p-3 rounded">
    <div className="flex justify-between items-center mb-2">
      <span className="rs-stat-label">Quest Points:</span>
      <span className="rs-stat-value">{totalPosts}/{totalPosts}</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span className="rs-stat-label">Quests Completed:</span>
      <span className="rs-stat-value">{totalPosts}/{totalPosts}</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span className="rs-stat-label">Countries Visited:</span>
      <span className="rs-stat-value">5</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="rs-stat-label">Distance Biked:</span>
      <span className="rs-stat-value">3,825km</span>
    </div>
    {/* Quest progress bar */}
    <div className="mt-3">
      <div className="quest-progress rounded-sm">
        <div className="quest-progress-fill" style={{ width: '100%' }}></div>
      </div>
      <p style={{ fontFamily: "'MedievalSharp', serif", fontSize: '10px', color: 'var(--rs-gold-dim)', textAlign: 'center', marginTop: '4px' }}>
        All quests complete!
      </p>
    </div>
  </div>
);

const Overlay = forwardRef(
  (
    {
      isIFrameView,
      selectedId,
      onSelection,
      onPrevClick,
      onNextClick,
      onIFrameClose,
      blogCardRefs,
      posts,
    },
    ref
  ) => {
    const hideOverflow = isIFrameView;

    return (
      <div className="overflow-hidden h-dvh relative rs-frame">
        <div
          ref={ref}
          className={`
            h-full w-full
            rs-panel
            flex flex-col items-center
            overlay-scroll
            ${hideOverflow ? "overflow-hidden" : "overflow-auto"}
          `}
        >
          <Header totalPosts={posts.length} completedPosts={posts.length} />
          {isIFrameView ? (
            <QuestReader
              postId={selectedId}
              onClose={onIFrameClose}
              onPrev={onPrevClick}
              onNext={onNextClick}
            />
          ) : null}

          <QuestStats totalPosts={posts.length} />

          <div className="w-full py-2">
            {posts.map((post, index) => (
              <BlogCard
                key={post.postId}
                postId={post.postId}
                postNumber={index + 1}
                selected={post.postId == selectedId}
                thumbnailUrl={post.thumbnail}
                mainHeader={post.web_title}
                subHeader={post.subtitle}
                createdAt={post.created_at}
                iframeUrl={post.htmlPath}
                onSelection={onSelection}
                totalPosts={posts.length}
                ref={(el) => {
                  blogCardRefs.current[index] = el;
                  return blogCardRefs.current[index];
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default Overlay;
