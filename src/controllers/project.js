import { Project } from "../database/models/index.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, technologies, imageUrl, liveUrl, repoUrl, featured } = req.body;

    const project = await Project.create({
      userId: req.user.id,
      title,
      description,
      technologies,
      imageUrl,
      liveUrl,
      repoUrl,
      featured,
    });

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!project) {
      return res.status(403).json({ message: "Project not found or not authorized" });
    }

    const updated = await project.update(req.body);
    res.json({ message: "Project updated", project: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!project) {
      return res.status(403).json({ message: "Project not found or not authorized" });
    }

    await project.destroy();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

