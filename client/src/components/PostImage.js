// PostImage.js
import React from "react";

export default function PostImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="img-fluid"
      loading="lazy"
    />
  );
}
