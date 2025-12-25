import { useState, useEffect } from "react";
import { uploadResume } from "../api/user";
import "./resumebanner.css";

function ResumeBanner() {
  const [loading, setLoading] = useState(false);
  // Initial State: Check if user ALREADY has skills in localStorage
  const [hasResume, setHasResume] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.skills && user.skills.length > 0;
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only");
      return;
    }

    try {
      setLoading(true);
      const res = await uploadResume(file);

      alert(res.message || "Resume uploaded successfully");

      // 1. Get existing user
      const existingUser = JSON.parse(localStorage.getItem("user")) || {};

      // 2. 🛑 FIX: Spread existingUser (Don't nest it inside 'user: ...')
      const updatedUser = {
          ...existingUser,       // Keep token, id, name, email
          skills: res.skills     // Add/Update skills array
      };

      // 3. Save to LocalStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // 4. Update state to hide banner immediately
      setHasResume(true);
      
      // 5. Notify other components
      window.dispatchEvent(new Event("storage"));

    } catch (err) {
      console.error(err);
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logic: If user has a resume (skills), DO NOT render this component
  if (hasResume) return null;

  return (
    <div className="resume-banner">
      <div>
        <strong>Upload your resume</strong> to get AI-powered skills scoring and access to join rooms.
      </div>

      <label className="btn btn-primary">
        {loading ? "Uploading..." : "Upload Resume"}
        <input
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

export default ResumeBanner;