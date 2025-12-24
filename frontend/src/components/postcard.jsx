import "./postcard.css";

function PostCard({ post }) {
  if (!post) return null;

  // Extract Image URL safely
  const imageUrl = post.media?.[0]?.url;

  return (
    <div className="card">
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
        <button className="btn btn-primary">Request to Join</button>
      </div>
    </div>
  );
}

export default PostCard;