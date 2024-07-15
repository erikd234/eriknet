import React, { useState } from "react";

const BlogClose = ({ children, className }) => {
  return <div className={"bg-white p-3 " + className}>{children}</div>;
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
