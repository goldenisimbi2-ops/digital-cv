
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";

// Import routers
import authRoutes from "./src/routers/auth.js";
import profileRoutes from "./src/routers/profile.js";
import projectRoutes from "./src/routers/project.js";
import skillRoutes from "./src/routers/skill.js";
import publicRoutes from "./src/routers/public.js";

dotenv.config();

const app = express();

console.log("DEBUG publicRoutes type:", typeof publicRoutes);
console.log("DEBUG publicRoutes has stack:", !!publicRoutes?.stack);
console.log("DEBUG publicRoutes routes:", publicRoutes?.stack?.map(l => l.route?.path).filter(Boolean));
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// API routes
app.get("/api", (req, res) => {
  res.json({ message: "Portfolio API is running!", port: PORT });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/public", publicRoutes);

// Try to connect to database, but don't fail if it doesn't work
sequelize
  .authenticate()
.then(() => sequelize.sync())
  .then(() => {
    console.log("Database connected successfully 🔥🔥🔥🔥🔥🔥🔥🔥🔥");
  })
  .catch((err) => {
    console.log("Database connection failed, but server will start anyway:", err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("API Endpoints:");
      console.log(`  POST   http://localhost:${PORT}/api/auth/register`);
      console.log(`  POST   http://localhost:${PORT}/api/auth/login`);
      console.log(`  GET    http://localhost:${PORT}/api/profile`);
      console.log(`  GET    http://localhost:${PORT}/api/projects`);
      console.log(`  GET    http://localhost:${PORT}/api/skills`);
    });
  });
