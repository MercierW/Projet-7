const { Sequelize, DataTypes, Model } = require("sequelize");
const DB = require("../serveur");

const User = DB.define("User", {
    // Model attributes are defined here
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pictureProfilURL: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    // Other model options go here
  }
);

module.exports = User;
