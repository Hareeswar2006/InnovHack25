import { useState } from "react";
import { uploadResume } from "../api/user";
import "./resumebanner.css";

function ResumeBanner() {
  const [loading, setLoading] = useState(false);

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

      const user = JSON.parse(localStorage.getItem("user")) || {};
      user.skills = res.skills || [];

      const existingUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
          ...existingUser,
          skills: res.data.skills
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (err) {
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

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
