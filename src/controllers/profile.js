import { Profile, User } from "../database/models/index.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { fullName, title, bio, location, phone, github, linkedin, website } = req.body;

    const [profile, created] = await Profile.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        userId: req.user.id,
        fullName: fullName || "isimbigolden",
        title: title || "Full Stack Developer",
        bio,
        location,
        phone,
        github,
        linkedin,
        website,
      },
    });

    if (!created) {
      return res.status(409).json({ message: "Profile already exists. Use PUT to update." });
    }

    res.status(201).json({ message: "Profile created", profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updated = await profile.update(req.body);
    res.json({ message: "Profile updated", profile: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

