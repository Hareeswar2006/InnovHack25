import "./postcard.css";
import { requestToJoinRoom } from "../api/rooms";
import {hasResume } from "../utils/user";

function PostCard({ post }) {

  const handleRequestToJoin = async () => {
    if (!post.room) {
      alert("No active room for this post");
      return;
    }

    if (!hasResume) {
      alert("Please upload your resume to request joining this team.");
      return;
    }

    try{
      const res = await requestToJoinRoom(post.room);

      alert(res.message || "Request sent successfully");
    }
    catch (error) {
      alert("Failed to send request");
    }
  };

  if (!post) return null;

  const imageUrl = post.media?.[0]?.url;

  return (
    <div className="card" id={`post-${post._id}`}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="card-image"
        />
      )}

      <h3 className="card-title">{post.title}</h3>
      <p className="card-meta">{post.description}</p>

      <div className="card-category-wrapper">
        <span className="category-badge">
          {post.category}
        </span>
      </div>

      <div className="card-actions">
        <button className="btn btn-outline">View</button>
        <button className="btn btn-primary" onClick={handleRequestToJoin}>Request to Join</button>
      </div>
    </div>
  );
}

export default PostCard;