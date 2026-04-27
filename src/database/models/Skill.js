import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("frontend", "backend", "database", "devops", "tools", "soft"),
      defaultValue: "frontend",
    },
    proficiency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 100,
      },
    },
  },
  {
    tableName: "skills",
    timestamps: true,
  }
);

export default Skill;

