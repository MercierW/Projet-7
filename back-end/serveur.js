// Imports
const { Sequelize, Model } = require("sequelize");

require('dotenv').config()

// Connexion à la DB
 module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});