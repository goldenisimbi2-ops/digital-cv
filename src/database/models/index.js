import User from "./User.js";
import Profile from "./Profile.js";
import Project from "./Project.js";
import Skill from "./Skill.js";

User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Project, { foreignKey: "userId", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Skill, { foreignKey: "userId", onDelete: "CASCADE" });
Skill.belongsTo(User, { foreignKey: "userId" });

export { User, Profile, Project, Skill };

