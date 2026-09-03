const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    business_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    subscription_plan: {
      type: DataTypes.ENUM("free", "basic", "premium"),
      allowNull: false,
      defaultValue: "free",
    },

    subscription_status: {
      type: DataTypes.ENUM("active", "inactive", "expired", "cancelled"),
      allowNull: false,
      defaultValue: "inactive",
    },

    subscription_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    subscription_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  },
);

module.exports = User;
