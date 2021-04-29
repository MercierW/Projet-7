const { Sequelize, DataTypes, Model } = require("sequelize");
const DB = require("../serveur");

const Message = DB.define("Message", {
    // Model attributes are defined here
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    }, 
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    like: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    dislike: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    imgURL: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    // Other model options go here
  }
);

module.exports = Message;
