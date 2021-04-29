// Imports
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const WF = require("async");
const User = require('../models/user');

// Token jwt
const SECRET_TOKEN = require('../utils/tokenKey');
const { password } = require("../utils/validator");

// Inscription
exports.register = (req, res) => {

    // Params
    let reqUserName = req.body.userName;
    let reqEmail = req.body.email;
    let reqPassword = req.body.password;

    // Waterfall
    WF.waterfall([
      function(done) {
        User.findOne({
          where: {
            userName: reqUserName,
          }
        })
        .then(function(userNameFound) {
          if(!userNameFound) {
            done(null)
          } else {
              return res.status(403).json({ error: 'Ce pseudo est déjà pris' });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ error: err });
        });
      },
      function(done) {
        User.findOne({
          where: {
            email: reqEmail, 
          }
        })
        .then(function(emailFound) {
          if(!emailFound) {
            done(null)
          } else {
            return res.status(403).json({ error: 'Cet email existe déjà' });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ error: err });
        });
      },
      function(done) {
        bcrypt.hash(reqPassword, 10, function( err, bcryptedPassword ) {
            let newUser = User.create({
                userName: reqUserName,
                email: reqEmail,
                password: bcryptedPassword,
                pictureProfilURL: 'http://localhost:5000/images/unknow-profil.jpg'
            })
            .then(function (newUser) {
                return res.status(201).json("Utilisateur créé : " + newUser.userName);
            })
            .catch(function (err) {
                return res.status(500).json({ error: err });
            });
        });
      }
    ]);
}

// Login
exports.login = (req, res) => {
    
    // Params
    let reqEmail    = req.body.email;
    let reqPassword = req.body.password;

    
    // Waterfall
    WF.waterfall(
      [
        function (done) {
          User.findOne({
            where: {
              email: reqEmail,
            },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "Problème" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(
              reqPassword,
              userFound.password,
              function (errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
              }
            );
          } else {
            return res.status(403).json({ error: "Cet utilisateur n'existe pas" });
          }
        },
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "Mot de passe incorrect" });
          }
        }
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json({
            pictureProfilURL: userFound.pictureProfilURL,
            userName: userFound.userName,
            userId: userFound.id,
            isAdmin: userFound.isAdmin,
            token: jwt.sign({ userId: userFound.id }, SECRET_TOKEN, {
              expiresIn: "1h",
            }),
          });
        } else {
          return res.status(500).json({ error: "Erreur impossible de se connecter" });
        }
      }
    );
  }

// modification du password
exports.modifyPassword = (req, res) => {
  // Params
  let oldpass = req.body.oldpass
  let newpass = req.body.newpass
  
  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  WF.waterfall([
    function(done) {
      User.findOne({
        where: {
          id: userId,
        },
      })
        .then(function (userFound) {
          done(null, userFound);
        })
        .catch(function (err) {
          return res.status(500).json({ error: err.message });
        });
    },
    function (userFound, done) {
        bcrypt.compare(
          oldpass,
          userFound.password,
          function (errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          }
        );
    },
    function (userFound, resBycrypt, done) {
      if (resBycrypt) {
        bcrypt.hash(newpass, 10, function( err, bcryptedPassword ) {
          userFound.update({
            password: bcryptedPassword
          })
          .then(passwordUpdated => {
            res.status(201).json(passwordUpdated)
          })
          .catch(err => {
            res.status(500).json({ error: err.message })
          })
        });
      } else {
        return res.status(403).json({ error: "Mot de passe incorrect" });
      }
    }
  ])
}

//  modification de l'image de profile
exports.modifyProfilPicture = (req, res) => {
  // Params
  let file = req.file

  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  WF.waterfall([
    function(done) {
      User.findOne({
        where: {
          id: userId
        }
      })
      .then(userFound => {
        done(null, userFound)
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
    },
    function(userFound, done) {
      userFound.update({
        pictureProfilURL: `${req.protocol}://${req.get('host')}/images/${file.filename}`
      })
      .then(pictureUpdated => {
        res.status(201).json(userFound.pictureProfilURL)
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
    },
  ])
}