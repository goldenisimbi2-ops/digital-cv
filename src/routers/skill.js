import express from "express";
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.js";
import { authenticate } from "../middelware/auth.js";

const router = express.Router();

router.get("/", authenticate, getAllSkills);
router.post("/", authenticate, createSkill);
router.put("/:id", authenticate, updateSkill);
router.delete("/:id", authenticate, deleteSkill);

export default router;

