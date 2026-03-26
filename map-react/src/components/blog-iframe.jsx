import React from "react";

const BlogClose = ({ children }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2"
         style={{
           background: 'linear-gradient(to bottom, var(--rs-brown) 0%, var(--rs-brown-dark) 100%)',
           borderBottom: '2px solid var(--rs-gold-dim)',
           boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
         }}>
      {children}
    </div>
  );
};

const BlogIframe = ({ iframeSrc, blogScrollPos, children }) => {
  const blogClose = React.Children.toArray(children).find(
    (child) => child.type === BlogClose
  );

  const src = `/html/${iframeSrc}`;
  const topValue = `${blogScrollPos}px`;
  return (
    <div
      className="absolute z-50 scroll-viewer"
      style={{ width: "100%", height: "100%", top: `${topValue}` }}
    >
      {blogClose}
      <iframe
        src={src}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "var(--rs-parchment)",
        }}
      />
    </div>
  );
};

export { BlogIframe, BlogClose };
