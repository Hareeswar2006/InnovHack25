import { getToken } from "../utils/auth";

const API_BASE = "https://p1w5x8bl-3000.inc1.devtunnels.ms";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/profile/upload-resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  return res.json();
};

