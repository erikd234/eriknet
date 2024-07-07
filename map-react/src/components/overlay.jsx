// src/Overlay.js
import React from "react";
import BlogCard from "./blog-card";
import BlogIframe from "./blog-iframe";

const Overlay = () => {
  return (
    <div className="h-full w-full bg-white flex flex-col justify-center">
      <BlogIframe blogName={"1"} />
    </div>
  );
};

export default Overlay;
