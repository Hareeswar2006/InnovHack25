import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestToJoinRoom } from "../api/rooms";
import { hasResume } from "../utils/user";
import "./postcard.css";

function PostCard({ post, currentUser }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [toast, setToast] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // 🟢 NEW: Expansion state
  const navigate = useNavigate();

  if (!post) return null;

  const media = post.media || [];
  const currentFile = media[currentMediaIndex];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRequestToJoin = async (e) => {
    e.stopPropagation(); // 🟢 Prevent expanding when clicking button
    if (!post.isOpen) return;
    if (!post.room) {
      showToast("No active room for this post", "error");
      return;
    }
    if (!hasResume()) {
      showToast("Please upload your resume to request joining.", "error");
      return;
    }
    try {
      const roomId = post.room._id || post.room;
      const res = await requestToJoinRoom(roomId);
      showToast(res.message || "Request sent successfully", "success");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      showToast("Failed to send request", "error");
    }
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const renderMedia = (file) => {
    if (!file) return null;
    if (file.type === "video") {
      return <video src={file.url} controls className="pro-media" />;
    }
    return <img src={file.url} alt={post.title} className="pro-media" />;
  };

  const renderActionButton = () => {
    if (!post.isOpen) return <button className="pro-btn outline is-closed" disabled>Position Filled</button>;
    if (post.createdBy?._id === currentUser?.id || post.createdBy === currentUser?.id) {
      return <button className="pro-btn outline" disabled>Your Post</button>;
    }
    if (!post.roomEnabled) return <button className="pro-btn outline" disabled>No Team</button>;

    let isMember = false;
    if (post.room && post.room.members) {
      isMember = post.room.members.some((member) => {
        const id = member.user?._id || member.user || member._id || member;
        return String(id) === String(currentUser.id);
      });
    }

    if (isMember) {
      return (
        <button className="pro-btn success" onClick={(e) => { e.stopPropagation(); navigate(`/rooms/${post.room._id || post.room}`); }}>
          Access Room
        </button>
      );
    }

    if (post.applicationStatus === "pending") return <button className="pro-btn outline" disabled>Requested</button>;
    if (post.applicationStatus === "rejected") return <button className="pro-btn danger" disabled>Rejected</button>;

    const currentMemberCount = post.room?.members?.length || 0;
    const maxCapacity = post.room?.teamSize || post.teamSize || 0;

    if (maxCapacity > 0 && currentMemberCount >= maxCapacity) {
      return <button className="pro-btn outline is-closed" disabled>Room Full ({currentMemberCount}/{maxCapacity})</button>;
    }

    return <button className="pro-btn primary-glow" onClick={handleRequestToJoin}>Request to Join</button>;
  };

  return (
    <div 
      className={`pro-card ${!post.isOpen ? "post-closed" : ""} ${isExpanded ? "expanded" : ""}`} 
      onClick={() => setIsExpanded(!isExpanded)} // 🟢 Toggle Expand
    >
      <div className="pro-header">
        <div className="avatar-circle">{post.createdBy?.name?.charAt(0) || "U"}</div>
        <div className="header-info">
          <div className="header-top-line">
            <h4 className="user-name">{post.createdBy?.name || "Unknown User"}</h4>
            {!post.isOpen && <span className="closed-pill">Closed</span>}
          </div>
          <div className="post-meta">
             <span className="category-text">{post.category}</span>
          </div>
        </div>
      </div>

      <div className="pro-body">
        <h3 className="pro-title">{post.title}</h3>
        <p className="pro-desc">{post.description}</p>
      </div>

      {media.length > 0 && (
        <div className="pro-media-wrapper">
          {renderMedia(currentFile)}
          {media.length > 1 && (
            <>
              <button className="media-nav left" onClick={nextSlide}>&#10094;</button>
              <button className="media-nav right" onClick={nextSlide}>&#10095;</button>
              <div className="media-counter">{currentMediaIndex + 1} / {media.length}</div>
            </>
          )}
        </div>
      )}

      {/* 🟢 SOCIAL BAR (Replacing View Details) */}
      <div className="social-interaction-bar">
        <div className="social-item">
          <span className="social-icon">❤️</span>
          <span className="social-count">{post.likesCount || 0}</span>
        </div>
        <div className="social-item">
          <span className="social-icon">💬</span>
          <span className="social-count">{post.comments?.length || 0}</span>
        </div>
        {/* Campus Badge (Moved into interaction bar for cleanliness) */}
        {post.scope === "college" && (
            <div className="campus-mini-badge">🎓 {currentUser?.college || "Campus"}</div>
        )}
      </div>

      <div className="pro-footer">
        <div className="action-area">
          {renderActionButton()}
        </div>
        <div className="expand-indicator">{isExpanded ? "▲ Hide" : "▼ Details"}</div>
      </div>

      {/* 🟢 EXPANDABLE SECTION */}
      {isExpanded && (
        <div className="expanded-content-area" onClick={(e) => e.stopPropagation()}>
          <div className="skills-section">
            <h5 className="section-label">Target Skills</h5>
            <div className="skill-tags">
              {post.skillsRequired?.map((skill, i) => (
                <span key={i} className="skill-tag-pill">{skill}</span>
              ))}
            </div>
          </div>

          <div className="comments-section">
            <h5 className="section-label">Discussion</h5>
            {post.comments?.length > 0 ? (
              post.comments.map((comment, i) => (
                <div key={i} className="comment-thread">
                  <div className="comment-main">
                    <strong>{comment.userName}:</strong> {comment.text}
                  </div>
                  {comment.replies?.map((reply, j) => (
                    <div key={j} className="comment-reply">
                      ↳ <strong>{reply.userName}:</strong> {reply.text}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Start the conversation!</p>
            )}
            <div className="add-comment-input">
                <input type="text" placeholder="Write a comment..." />
                <button className="send-comment-btn">↗</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`pc-toast ${toast.type}`}>
           <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default PostCard;