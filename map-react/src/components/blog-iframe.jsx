import React from "react";

const BlogClose = ({ children }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100 shadow-sm">
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
      className="absolute z-50"
      style={{ width: "100%", height: "100%", top: `${topValue}` }}
    >
      {blogClose}
      <iframe
        src={src}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export { BlogIframe, BlogClose };
