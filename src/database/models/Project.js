import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Project = sequelize.define(
  "Project",
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    technologies: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("technologies");
        return raw ? raw.split(",") : [];
      },
      set(val) {
        this.setDataValue(
          "technologies",
          Array.isArray(val) ? val.join(",") : val
        );
      },
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    liveUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    repoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
  }
);

export default Project;

