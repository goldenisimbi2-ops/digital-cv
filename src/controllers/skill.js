import { Skill } from "../database/models/index.js";

export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      where: { userId: req.user.id },
      order: [["category", "ASC"], ["name", "ASC"]],
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const skill = await Skill.create({
      userId: req.user.id,
      name,
      category: category || "frontend",
      proficiency,
    });

    res.status(201).json({ message: "Skill created", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!skill) {
      return res.status(403).json({ message: "Skill not found or not authorized" });
    }

    const updated = await skill.update(req.body);
    res.json({ message: "Skill updated", skill: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!skill) {
      return res.status(403).json({ message: "Skill not found or not authorized" });
    }

    await skill.destroy();
    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

