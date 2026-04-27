import express from "express";
import { getProfile, createProfile, updateProfile } from "../controllers/profile.js";
import { authenticate } from "../middelware/auth.js";

const router = express.Router();

router.get("/", authenticate, getProfile);
router.post("/", authenticate, createProfile);
router.put("/", authenticate, updateProfile);

export default router;

