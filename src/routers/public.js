import express from "express";
import { Profile, Project, Skill, User } from "../database/models/index.js";

const router = express.Router();

// Public profile endpoint
router.get("/profile", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public projects endpoint
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public skills endpoint
router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [["category", "ASC"], ["name", "ASC"]],
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

