import React, { forwardRef } from "react";
import BlogCard from "./blog-card";
import { BlogIframe, BlogClose } from "./blog-iframe";
import Spinner from "./spinner";

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
      <span className="rs-stat-value">???km</span>
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
      selIframeSrc,
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
            <BlogIframe iframeSrc={selIframeSrc} blogScrollPos={0}>
              <BlogClose>
                <button
                  onClick={onIFrameClose}
                  className="toolbar-btn"
                  title="Back to quest log"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                  </svg>
                  <span>Back</span>
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={onPrevClick}
                    className="toolbar-btn"
                    title="Previous quest"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                    <span>Prev</span>
                  </button>
                  <button
                    onClick={onNextClick}
                    className="toolbar-btn"
                    title="Next quest"
                  >
                    <span>Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </BlogClose>
            </BlogIframe>
          ) : null}
          {isIFrameView ? (
            <div className="w-full h-full absolute z-40" style={{ background: 'var(--rs-parchment)' }}>
              <Spinner />
            </div>
          ) : null}

          <QuestStats totalPosts={posts.length} />

          <div className="w-full max-w-2xl py-2 px-1">
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
                iframeUrl={`/${post.htmlPath}`}
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
