import { useState } from "react";
import { createPost } from "../api/posts";
import "./createpost.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "project",
    skillsRequired: "",
    teamSize: 4,
    roomEnabled: false,
  });

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    setFiles((prevFiles) => {
      const combinedFiles = [...prevFiles, ...newFiles];

      if (combinedFiles.length > 5) {
        alert(`You can only upload 5 files max. You currently have ${prevFiles.length}.`);
        return prevFiles;
      }

      return combinedFiles;
    });
    e.target.value = ""; 
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("skillsRequired", form.skillsRequired); 
      formData.append("teamSize", form.teamSize);
      formData.append("roomEnabled", form.roomEnabled);

      files.forEach((file) => {
        formData.append("files", file); 
      });

      await createPost(formData);

      if (form.roomEnabled) {
        alert("Post and Room created successfully!");
        navigate("/rooms/my-rooms");
      } else {
        alert("Post create successfully!");
        navigate("/announcements");
      }

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <select name="category" onChange={handleChange}>
          <option value="project">Project</option>
          <option value="hackathon">Hackathon</option>
        </select>

        <input
          name="skillsRequired"
          placeholder="Skills (comma separated)"
          onChange={handleChange}
        />

        <div className="file-input-group">
            <label>Attachments (Max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={handleFileChange}
            />

            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <span>{file.name}</span>
                  <button 
                    type="button" 
                    onClick={() => removeFile(index)}
                    className="remove-btn"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>

            <p className="hint">{files.length}/5 files selected</p>
        </div>

        <label className="toggle">
          <input
            type="checkbox"
            name="roomEnabled"
            onChange={handleChange}
          />
          Enable Room (Form team)
        </label>

        {form.roomEnabled && (
             <input
             type="number"
             name="teamSize"
             placeholder="Team Size"
             value={form.teamSize}
             min="1"
             onChange={handleChange}
           />
        )}

        <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;