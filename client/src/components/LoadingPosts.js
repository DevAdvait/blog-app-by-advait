import React from 'react';
import './LoadingPosts.css'; // Import the CSS file for the loading styles

export default function LoadingPosts() {
  return (
    <div className="loading-container">
      <div className="loading-image-shadow"></div>
      <div className="loading-content-shadow">
        <div className="loading-title-shadow"></div>
        <div className="loading-summary-shadow"></div>
      </div>
    </div>
  );
}
