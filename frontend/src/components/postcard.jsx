import { useState } from "react";
import { requestToJoinRoom } from "../api/rooms";
import { hasResume } from "../utils/user"; // Assuming this is a function, if it's a variable remove the ()
import "./postcard.css";

function PostCard({ post }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Safety check if post is null
  if (!post) return null;

  const media = post.media || [];
  const currentFile = media[currentMediaIndex];

  const handleRequestToJoin = async () => {
    if (!post.room) {
      alert("No active room for this post");
      return;
    }
    // Assuming hasResume is a function checking localStorage. 
    // If it is just a boolean variable in your utils, remove the ()
    if (!hasResume()) { 
      alert("Please upload your resume to request joining this team.");
      return;
    }

    try {
      const res = await requestToJoinRoom(post.room);
      alert(res.message || "Request sent successfully");
    } catch (error) {
      alert("Failed to send request");
    }
  };

  // Slider Logic
  const nextSlide = (e) => {
    e.stopPropagation(); // Prevent triggering card click if any
    setCurrentMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  // Helper to render media based on type (image/video/pdf)
  const renderMedia = (file) => {
    if (!file) return null;

    if (file.type === "video") {
      return (
        <video 
          src={file.url} 
          controls 
          className="card-media" 
        />
      );
    }
    
    // Default to image for "image" or unknown types
    return (
      <img 
        src={file.url} 
        alt={post.title} 
        className="card-media" 
      />
    );
  };

  return (
    <div className="card" id={`post-${post._id}`}>
      
      {/* 🌟 MEDIA CAROUSEL SECTION */}
      {media.length > 0 && (
        <div className="media-container">
          
          {/* Render the current file */}
          {renderMedia(currentFile)}

          {/* Show Arrows ONLY if there is more than 1 file */}
          {media.length > 1 && (
            <>
              <button className="slider-btn left" onClick={prevSlide}>
                &#10094; {/* Left Arrow Entity */}
              </button>
              
              <button className="slider-btn right" onClick={nextSlide}>
                &#10095; {/* Right Arrow Entity */}
              </button>

              {/* Optional: Page Indicator (1/5) */}
              <div className="slider-count">
                {currentMediaIndex + 1} / {media.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* CARD BODY */}
      <div className="card-body">
        <h3 className="card-title">{post.title}</h3>
        <p className="card-meta">{post.description}</p>

        <div className="card-category-wrapper">
          <span className="category-badge">
            {post.category}
          </span>
        </div>

        <div className="card-actions">
          <button className="btn btn-outline">View</button>
          <button className="btn btn-primary" onClick={handleRequestToJoin}>
            Request to Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;