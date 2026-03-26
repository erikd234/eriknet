import React, { forwardRef } from "react";
import BlogCard from "./blog-card";
import { BlogIframe, BlogClose } from "./blog-iframe";
import Spinner from "./spinner";

const LeafSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 35 C5 35, 10 5, 35 5 C35 5, 25 10, 20 20 C15 30, 5 35, 5 35Z" fill="currentColor" opacity="0.6"/>
    <path d="M5 35 C12 22, 20 15, 35 5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" fill="none"/>
    <path d="M10 30 C14 24, 18 20, 28 12" stroke="currentColor" strokeWidth="0.5" opacity="0.3" fill="none"/>
    <path d="M8 32 C11 28, 15 25, 22 18" stroke="currentColor" strokeWidth="0.5" opacity="0.3" fill="none"/>
  </svg>
);

const Header = () => (
  <div className="wooden-sign sticky top-0 z-10 w-full">
    <div className="flex items-center justify-center gap-3 px-5 py-3">
      <span className="text-xl select-none">🌿</span>
      <h1 className="text-lg font-bold tracking-wide">
        Erik's European Bike Trip
      </h1>
      <span className="text-xl select-none">🚲</span>
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
      <div className="overflow-hidden h-dvh relative bamboo-frame">
        {/* Leaf corner decorations */}
        <div className="leaf-corner-tl" style={{ color: 'var(--jungle-light)' }}>
          <LeafSVG />
        </div>
        <div className="leaf-corner-br" style={{ color: 'var(--jungle-light)' }}>
          <LeafSVG />
        </div>

        <div
          ref={ref}
          className={`
            h-full w-full
            jungle-panel
            flex flex-col items-center
            overlay-scroll
            ${hideOverflow ? "overflow-hidden" : "overflow-auto"}
          `}
        >
          <Header />
          {isIFrameView ? (
            <BlogIframe iframeSrc={selIframeSrc} blogScrollPos={0}>
              <BlogClose>
                <button
                  onClick={onIFrameClose}
                  className="toolbar-btn"
                  title="Back to list"
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
                    title="Previous post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                    <span>Prev</span>
                  </button>
                  <button
                    onClick={onNextClick}
                    className="toolbar-btn"
                    title="Next post"
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
            <div className="w-full h-full bg-white absolute z-40">
              <Spinner />
            </div>
          ) : null}

          <div className="w-full max-w-2xl py-3 px-1">
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
