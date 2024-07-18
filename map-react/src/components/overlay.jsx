import React, { forwardRef } from "react";
import BlogCard from "./blog-card";
import { BlogIframe, BlogClose } from "./blog-iframe";
import Spinner from "./spinner";

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
          h-full
          w-full
        bg-white
          flex
          flex-col
          items-center
          ${hideOverflow ? "overflow-hidden" : "overflow-auto"}`}
        >
          <div className="p-5 text-xl font-bold">Erik's European Bike Trip</div>
          {isIFrameView ? (
            <BlogIframe iframeSrc={selIframeSrc} blogScrollPos={0}>
              <BlogClose className={"flex justify-between"}>
                <button onClick={onIFrameClose}>back</button>
                <button onClick={onPrevClick}>Prev</button>
                <button onClick={onNextClick}>Next</button>
              </BlogClose>
            </BlogIframe>
          ) : (
            ""
          )}
          {isIFrameView ? (
            <div className="w-full h-full bg-white absolute z-40">
              <Spinner />
            </div>
          ) : (
            ""
          )}

          {posts.map((post, index) => (
            <BlogCard
              key={post.postId}
              postId={post.postId}
              selected={post.postId == selectedId}
              thumbnailUrl={post.thumbnail}
              mainHeader={post.web_title}
              subheader={post.subtitle}
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
    );
  }
);

export default Overlay;
