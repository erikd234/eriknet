import React from "react";

const BlogIframe = ({ blogName }) => {
  const iframeSrc = `/html/${blogName}.html`;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={iframeSrc}
        title={blogName}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export default BlogIframe;
