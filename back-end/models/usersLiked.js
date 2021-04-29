const { Sequelize, DataTypes, Model } = require("sequelize");
const DB = require("../serveur");

const UsersLiked = DB.define(
  "usersliked",
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    usersLikedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    messagesLikedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Message",
        key: "id",
      },
    },
    userName: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
  },
  {
    // Other model options go here
  }
);

module.exports = UsersLiked;
