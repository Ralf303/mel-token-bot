import db from "../config.js";
import { DataTypes } from "sequelize";

const User = db.define("user", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
  },
  firstname: { type: DataTypes.STRING, defaultValue: "" },
  balance: { type: DataTypes.INTEGER, defaultValue: 777 },
  address: { type: DataTypes.STRING, defaultValue: "" },
  referals: { type: DataTypes.INTEGER, defaultValue: 0 },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export default User;
