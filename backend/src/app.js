import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import roomRoutes from "./routes/room.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/rooms", roomRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("SkillSync API running");
});

export default app;
