import React, { useState, useEffect, useRef } from "react";

const QuestReader = ({ postId, onClose, onPrev, onNext }) => {
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/parsed/${postId}.json`)
      .then((res) => res.json())
      .then((data) => {
        setQuest(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading quest:", err);
        setLoading(false);
      });
  }, [postId]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [postId]);

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "heading":
        return (
          <h2 key={index} className="quest-reader-heading">
            {block.text}
          </h2>
        );
      case "paragraph":
        return (
          <p key={index} className="quest-reader-paragraph">
            {block.text}
          </p>
        );
      case "image":
        return (
          <figure key={index} className="quest-reader-figure">
            <img
              src={block.src}
              alt={block.caption || ""}
              className="quest-reader-image"
              onClick={() => setEnlargedImage(block.src)}
              loading="lazy"
            />
            {block.caption && (
              <figcaption className="quest-reader-caption">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      case "list":
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag key={index} className="quest-reader-list">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ListTag>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute z-50 w-full h-full flex flex-col" style={{ background: "var(--rs-parchment)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{
          background: "linear-gradient(to bottom, var(--rs-brown) 0%, var(--rs-brown-dark) 100%)",
          borderBottom: "2px solid var(--rs-gold-dim)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <button onClick={onClose} className="toolbar-btn" title="Back to quest log">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          <span>Back</span>
        </button>
        <div className="flex gap-1">
          <button onClick={onPrev} className="toolbar-btn" title="Previous quest">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            <span>Prev</span>
          </button>
          <button onClick={onNext} className="toolbar-btn" title="Next quest">
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={contentRef} className="flex-1 overflow-auto overlay-scroll quest-reader-scroll">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="quest-reader-loading">Loading quest...</span>
          </div>
        ) : quest ? (
          <div className="quest-reader-content">
            <h1 className="quest-reader-title">{quest.title}</h1>
            <div className="rs-divider">~ * ~</div>
            {quest.blocks.map(renderBlock)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="quest-reader-loading">Quest not found</span>
          </div>
        )}
      </div>

      {/* Image lightbox */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setEnlargedImage(null)}
        >
          <img
            src={enlargedImage}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded"
            style={{ border: "3px solid var(--rs-gold)" }}
          />
        </div>
      )}
    </div>
  );
};

export default QuestReader;
