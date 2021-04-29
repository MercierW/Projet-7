// Imports
const express = require("express");
const bodyParser = require("body-parser");
const DB = require('./serveur');
const path = require('path');
const helmet = require("helmet");

// Constan
const app = express();

// Import routes
const signAndLoginRoutes = require('./routes/userRoute');
const messageRoute = require('./routes/messageRoute');

// Routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
      );
      next();
    });

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }));   
app.use(bodyParser.json());

app.use("/user", signAndLoginRoutes);
app.use("/message", messageRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));


// Test de la connexion à la DB
try {
  DB.authenticate();
  console.log("Connexion établie à la base de donnée.");
} catch (error) {
  console.error("Impossible de se connecter à la base de donnée:", error);
}

// Port de connexion
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Serveur actif sur le port ' + PORT));

// Export app
module.exports = app;