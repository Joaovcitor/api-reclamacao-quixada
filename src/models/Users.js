import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Users = sequelize.define("Users", {
  name: {
    type: DataTypes.STRING,
    validate: {
      len: [3, 155]
    },
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    validate: {
      len: [11, 11]
    },
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("comum", "adm"),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Users