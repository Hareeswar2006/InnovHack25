import { useEffect, useState } from "react";
import { fetchMyPostsWithoutRoom } from "../api/posts";
import { createRoom } from "../api/rooms";
import { useNavigate } from "react-router-dom";
import "./createroom.css";

function CreateRoom() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      const res = await fetchMyPostsWithoutRoom();
      setPosts(res.posts || []);
    };
    loadPosts();
  }, []);

  const handleCreateRoom = async (postId) => {
    const res = await createRoom(postId);
    navigate(`/rooms/${res.room.id}`);
  };

  return (
    <div className="create-room-container">
      <h2>Create Room</h2>

      <button
        className="btn btn-outline"
        onClick={() => navigate("/posts/create")}
      >
        + Create New Post
      </button>

      <h3>Select an existing post</h3>

      {posts.length === 0 && (
        <p>No eligible posts found</p>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          className="room-select-card"
          onClick={() => handleCreateRoom(post._id)}
        >
          <h4>{post.title}</h4>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
}

export default CreateRoom;
