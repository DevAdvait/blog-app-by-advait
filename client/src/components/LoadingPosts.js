import React from 'react';
import './LoadingPosts.css'; // Import the CSS file for the loading styles

const LoadingPost = () => (
  <div className="loading-container">
    <div className="loading-image-shadow"></div>
    <div className="loading-content-shadow">
      <div className="loading-title-shadow"></div>
      <div className="loading-summary-shadow"></div>
    </div>
  </div>
);

export default function LoadingPosts() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <LoadingPost key={index} />
      ))}
    </>
  );
}
