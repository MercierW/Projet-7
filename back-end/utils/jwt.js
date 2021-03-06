//Import
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = require("../utils/tokenKey");


//TOKEN POUR AUTHENTIFICATION
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};