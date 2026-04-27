import bcrypt from "bcryptjs";
import sequelize from "../../config/db.js";
import { User, Profile, Project, Skill } from "../models/index.js";

const SEED_PASSWORD = "password123";

async function seed() {
  try {
    await sequelize.sync({ alter: true });

    // Check if user already exists
    let user = await User.findOne({ where: { email: "golden2@gmail.com" } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
      user = await User.create({
        name: "isimbigolden",
        email: "golden2@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ User created: isimbigolden");
    } else {
      console.log("ℹ️  User already exists: isimbigolden");
    }

    // Seed profile
    let profile = await Profile.findOne({ where: { userId: user.id } });
    if (!profile) {
      profile = await Profile.create({
        userId: user.id,
        fullName: "isimbigolden",
        title: "Full Stack Developer",
        bio: "Passionate full stack developer with experience in building scalable web applications using modern technologies.",
        location: "Remote / Worldwide",
        phone: null,
        github: "https://github.com/isimbigolden",
        linkedin: null,
        website: null,
      });
      console.log("✅ Profile created");
    } else {
      console.log("ℹ️  Profile already exists");
    }

    // Seed projects
    const projectCount = await Project.count({ where: { userId: user.id } });
    if (projectCount === 0) {
      await Project.bulkCreate([
        {
          userId: user.id,
          title: "Portfolio API",
          description: "A RESTful API built with Express and Sequelize to manage a developer portfolio.",
          technologies: ["Node.js", "Express", "Sequelize", "MySQL"],
          imageUrl: null,
          liveUrl: null,
          repoUrl: null,
          featured: true,
        },
        {
          userId: user.id,
          title: "E-Commerce Platform",
          description: "Full-stack e-commerce application with user authentication, product management, and payment integration.",
          technologies: ["React", "Node.js", "Express", "MongoDB"],
          imageUrl: null,
          liveUrl: null,
          repoUrl: null,
          featured: false,
        },
      ]);
      console.log("✅ Projects seeded");
    } else {
      console.log("ℹ️  Projects already seeded");
    }

    // Seed skills
    const skillCount = await Skill.count({ where: { userId: user.id } });
    if (skillCount === 0) {
      await Skill.bulkCreate([
        { userId: user.id, name: "JavaScript", category: "frontend", proficiency: 90 },
        { userId: user.id, name: "React", category: "frontend", proficiency: 85 },
        { userId: user.id, name: "Node.js", category: "backend", proficiency: 88 },
        { userId: user.id, name: "Express", category: "backend", proficiency: 85 },
        { userId: user.id, name: "MySQL", category: "database", proficiency: 80 },
        { userId: user.id, name: "Git", category: "tools", proficiency: 85 },
      ]);
      console.log("✅ Skills seeded");
    } else {
      console.log("ℹ️  Skills already seeded");
    }

    console.log("\n🎉 Seed completed successfully!");
    console.log(`🔑 Login credentials: golden2@gmail.com / ${SEED_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seed();

