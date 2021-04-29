const { Sequelize, DataTypes, Model } = require("sequelize");
const DB = require("../serveur");

const Response = DB.define("Response", {
    // Model attributes are defined here
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Message",
        key: "id",
      },
    }, 
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
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

module.exports = Response;
