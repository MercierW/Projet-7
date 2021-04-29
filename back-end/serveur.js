// Imports
const { Sequelize, Model } = require("sequelize");

require('dotenv').config()

// Connexion à la DB
 module.exports = new Sequelize("test", "root", "", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});