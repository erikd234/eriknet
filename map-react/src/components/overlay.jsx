import React, { forwardRef } from "react";
import BlogCard from "./blog-card";
import { BlogIframe, BlogClose } from "./blog-iframe";
import Spinner from "./spinner";

const Header = () => (
  <div className="sticky top-0 z-10 w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 backdrop-blur-sm border-b border-amber-100/60">
    <div className="flex items-center justify-center gap-2 px-5 py-3">
      <span className="text-lg select-none">🚲</span>
      <h1 className="text-lg font-bold tracking-tight text-gray-800">
        Erik's European Bike Trip
      </h1>
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
      <div className="overflow-hidden h-dvh relative">
        <div
          ref={ref}
          className={`
            h-full w-full
            bg-gray-50
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

          <div className="w-full max-w-2xl py-2">
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
