// Imports
const Message = require("../models/message");
const Response = require("../models/response");
const User = require("../models/user");
const WF = require("async");
const SECRET_TOKEN = require("../utils/tokenKey");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../models/message");

// REGEXP
const validInput = RegExp(/[${}<>]/);

// Création de message
exports.createMessage = (req, res) => {
  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  // Params
  let message = req.body.message;
  let file = req.file

  console.log(req.body)

  if (!message) {
    return res.status(400).json({ error: "Message vide" });
  }

  if (validInput.test(message)) {
    return res
      .status(400)
      .json({ error: "Les symbols suivant sont interdits: ${}<>" });
  }

  // Waterfall
  WF.waterfall(
    [
      function (done) {
        User.findOne({
          where: {
            id: userId,
          },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "Erreur serveur" });
          });
      },
      function (userFound, done) {
        let imgUrl = null
        if (file) {
          imgUrl = `${req.protocol}://${req.get('host')}/images/${file.filename}`
        }
        if (userFound) {
          Message.create({
            userId: userFound.id,
            userName:userFound.userName,
            content: req.body.message,
            like: 0,
            dislike: 0,
            imgURL: imgUrl
          })
            .then(function (newMessage) {
              done(newMessage);
            })
            .catch(function (err) {
              return res.status(500).json({ error: err });
            });
        } else {
          res.status(404).json({ error: "Cet utilisateur n'existe pas" });
        }
      },
    ],
    function (newMessage) {
      if (newMessage) {
        return res.status(201).json(newMessage);
      } else {
        return res
          .status(500)
          .json({ error: "Impossible de poster le message" });
      }
    }
  );
};

// Modification de message
exports.modifyMessage = (req, res) => {
  // Params
  let file = req.file
  let messageId = parseInt(req.body.messageId)
  let reqContent = req.body.message

  console.log(file)

  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;


  if (!reqContent) {
    return res.status(400).json({ error: "Message vide" });
  }

  if (validInput.test(reqContent)) {
    return res
      .status(400)
      .json({ error: "Les symbols suivant sont interdits: ${}<>" });
  }

  // Waterfall
  WF.waterfall([
    function (done) {
      Message.findOne({
        where: {
          id: messageId,
          userId: userId,
        },
      })
        .then((messageFound) => {
          done(null, messageFound);
        })
        .catch((err) => {
          return res.status(500).json({ error: "Erreur serveur" });
        });
    },
    function (messageFound, done) {
      if (file === undefined) {
        file = messageFound.imgURL
      } else {
        file = `${req.protocol}://${req.get('host')}/images/${file.filename}`
      }

      if (messageFound) {
        messageFound
          .update({
            content: reqContent,
            imgURL: file
          })
          .then(() => {
            return res
              .status(200)
              .json({ message: "Votre message à bien été changé" });
          })
          .catch((err) => {
            return res.status(500).json({ error: "Erreur serveur" });
          });
      } else {
        return res.status(404).json({ error: "Le message n'existe plus" });
      }
    },
  ]);
};

// Supression du message
exports.messageDeleted = (req, res) => {

  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  // Params
  let messageId = parseInt(req.params.messageId);

  // Waterfall
  WF.waterfall([
    function (done) {
      Message.findOne({
        where: {
          id: messageId,
          userId: userId,
        },
      })
        .then((messageFound) => {
          done(null, messageFound);
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    },
    function (messageFound, done) {
      if (messageFound) {
        messageFound
          .destroy({
            where: {
              content: messageFound.content,
            },
          })
          .then(() => {
            return res
              .status(200)
              .json({ message: "Votre message à bien été supprimé" });
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      } else {
        return res.status(404).json({ error: "Le message n'existe plus" });
      }
    },
  ]);
};

// Affiche tous les messages
exports.getAllMessages = (req, res) => {
 
  WF.waterfall([
    function (done) {
      if(req.query.numberOfMessage === undefined) {
        Message.findAll({
          order: [ ['id', 'DESC'],],
          offset: 0,
          limit: 2,
        })
          .then((messagesFound) => {
           done(null, messagesFound) 
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });

      } else {
        Message.findAll({
          order: [ ['id', 'DESC'],],
          offset: parseInt(req.query.numberOfMessage),
          limit: 2
        })
          .then((messagesFound) => {
           done(null, messagesFound) 
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
    },
    function (messagesFound, done) {
      let arrayOfMessageID = []
      messagesFound.forEach(messageFound => {
        arrayOfMessageID.push(messageFound.id)
      });
      Response.findAll({
        where: {
          messageId: arrayOfMessageID
        }
      })
      .then((responsesFound) => {
        done(null, responsesFound, messagesFound)
      })
      .catch(err => {
        res.status(500).json({ error: err.message})
      })
    },
    function (responsesFound ,messagesFound ,done) {
      if(responsesFound && messagesFound) {
        let messages = []
        messagesFound.forEach(message => {
          messages.push(message.dataValues) 
        })
        messages.forEach(message => {
          message.responses = []
          responsesFound.forEach(response => {
            if(message.id === response.messageId) {
              message.responses.push(response)
            }
          })
        })

        if(messages.length === 0) {
          return res.status(200).json({fin:'fin'})
        } else {
          res.status(200).json({messages})
        }
      } else {
        res.status(500).json({ error: 'Message ou réponse introuvable'})
      }
    }
  ])
};

// Post la réponse d'un message
exports.postResponses = (req, res) => {

  // Params
  let response = req.body.response
  let messageId = req.body.messageId
  let file = req.file
  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  // Waterfall
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
        res.status(500).json({error: 'Utilisateur inexistant'})
      })
    },
    function(userFound, done) {
      let imgUrl = null
      if (file) {
        imgUrl = `${req.protocol}://${req.get('host')}/images/${file.filename}`
      }
      Response.create({
        messageId: messageId,
        userName: userFound.userName,
        content: response,
        imgURL: imgUrl
      })
      .then(newResponse => {
        res.status(201).json(newResponse)
      })
      .catch(err => {
        res.status(500).json({error: err.message})
      })
    }
  ])
}

// Suppresion du message par un admin
exports.deleteMessageFromAdmin = (req, res) => {
  // Params
  let messageId = parseInt(req.params.messageId);

  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  // Waterfall
  WF.waterfall([
    function (done) {
      Message.findOne({
        where: {
          id: messageId,
        },
      })
        .then((messageFound) => {
          done(null, messageFound);
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    },
    function (messageFound, done) {
      User.findOne({
        where: {
          id: userId
        }
      })
      .then(userFound => {
        done(null, userFound, messageFound)
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
    },
    function (userFound, messageFound, done) {
      if (userFound.dataValues.isAdmin === 1) {
        messageFound
          .destroy({
            where: {
              id: messageId,
            },
          })
          .then(() => {
            return res
              .status(200)
              .json({ message: "Votre message à bien été supprimé" });
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      } else {
        return res.status(404).json({ error: "Vous n'avez le status requis pour faire cela" });
      }
    },
  ]);
}

// Suppresion d'une réponse par un admin
exports.deleteResponseFromAdmin = (req, res) => {
  // Params
  let responseId = parseInt(req.params.responseId);

  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  WF.waterfall([
    function (done) {
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
    function (userFound, done) {
      Response.findOne({
        where: {
          id: responseId
        }
      })
      .then(responseFound => {
        done(null, responseFound, userFound)
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      }) 
    },
    function (responseFound, userFound, done) {
      if(userFound.dataValues.isAdmin === 1) {
        responseFound.destroy({
          id: responseId
        })
        .then(() => {
          res.status(201).json('Message supprimé avec succès')
        })
        .catch(err => {
          res.status(500).json({ error: err.message })
        })
      } else {
        res.status(500).json({ error: err.messsage })
      }
    }
  ])
}

exports.getResponses = (req, res) => {
  let messageId = req.query.messageId

  WF.waterfall([
    function(done) {
      Response.findAll({
        where: {
          messageId: messageId
        }
      })
      .then(responseFound => {
        res.status(200).json(responseFound)
      })
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
    }
  ])
}