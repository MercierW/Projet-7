// Imports
const Message = require("../models/message");
const Like = require("../models/usersLiked");
const Dislike = require("../models/usersDisliked");
const User = require("../models/user");
const WF = require("async");
const SECRET_TOKEN = require("../utils/tokenKey");
const jwt = require("jsonwebtoken");


// Like un message
exports.like = (req, res) => {
  // Params
  const messageId = req.body.messageId;
  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  // Waterfall
    WF.waterfall([
        function(done) {
            Like.findOne({
                where: {
                    usersLikedId: userId,
                    messagesLikedId: messageId
                }
            })
            .then(function(likeFound) {
                done(null, likeFound)
            })
            .catch(function(err) {
                res.status(500).json({error: err.message})
            })
        },
        function(likeFound, done) {
            Dislike.findOne({
                where: {
                    usersDislikedId: userId,
                    messagesDislikedId: messageId
                }
            })
            .then(function(dislikeFound) {
                done(null, dislikeFound, likeFound)
            })
            .catch(function(err) {
                res.status(500).json({error: err.message})
            })
        },
        function(dislikeFound, likeFound, done) {
            Message.findOne({
                where: {
                    id: messageId
                }
            })
            .then(messageFound => {
                done(null, messageFound, dislikeFound, likeFound)
            })
            .catch(err => {
                res.status(500).json({error: 'Message inexistant'})
            })
        },
        function(messageFound, dislikeFound ,likeFound, done) {
            User.findOne({
                where: {
                    id: userId
                }
            })
            .then(userFound => {
                done(null, userFound, messageFound, dislikeFound ,likeFound)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
        },
        function(userFound, messageFound, dislikeFound, likeFound, done) {
            if(likeFound) {
                likeFound.destroy({
                    where: {
                        usersLikedId: userId,
                        messagesLikedId: messageId 
                    }
                })
                .then(() => {
                    messageFound.update({
                        like: messageFound.like - 1
                    })
                    .then(messageUpdated => {
                        res.status(200).json(messageUpdated)
                    })
                    .catch(err => {
                        res.status(500).json({error: err.message})
                    })
                })
                .catch(err => {
                    res.status(500).json({error: err.message})
                })
            } else if(dislikeFound) {
                res.status(406).json('action impossible')
            } else {
                Like.create({
                    usersLikedId: userId,
                    messagesLikedId: messageId,
                    userName: userFound.userName
                })
                .then(() => {
                    messageFound.update({
                        like: messageFound.like + 1
                     })
                     .then(messageUpdated => {
                         res.status(200).json(messageUpdated)
                     })
                     .catch(err => {
                         res.status(500).json({error: err.message})
                     })
                })
                .catch(err => {
                    res.status(500).json({error: err.message})
                })
            }
        }
    ])
};

// Dislike un message
exports.dislike = (req, res) => {
    // Params
  const messageId = req.body.messageId;
  // Getting userID
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_TOKEN);
  const userId = decodedToken.userId;

  // Waterfall
    WF.waterfall([
        function(done) {
            Like.findOne({
                where: {
                    usersLikedId: userId,
                    messagesLikedId: messageId
                }
            })
            .then(function(likeFound) {
                done(null, likeFound)
            })
            .catch(function(err) {
                res.status(500).json({error: err.message})
            })
        },
        function(likeFound, done) {
            Dislike.findOne({
                where: {
                    usersDislikedId: userId,
                    messagesDislikedId: messageId
                }
            })
            .then(function(dislikeFound) {
                done(null, dislikeFound, likeFound)
            })
            .catch(function(err) {
                res.status(500).json({error: err.message})
            })
        },
        function(dislikeFound, likeFound, done) {
            Message.findOne({
                where: {
                    id: messageId
                }
            })
            .then(messageFound => {
                done(null, messageFound, dislikeFound, likeFound)
            })
            .catch(err => {
                res.status(500).json({error: 'Message inexistant'})
            })
        },
        function(messageFound, dislikeFound ,likeFound, done) {
            User.findOne({
                where: {
                    id: userId
                }
            })
            .then(userFound => {
                done(null, userFound, messageFound, dislikeFound ,likeFound)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
        },
        function(userFound, messageFound, dislikeFound, likeFound, done) {
            if(dislikeFound) {
                dislikeFound.destroy({
                    where: {
                        usersdislikedId: userId,
                        messagesdislikedId: messageId 
                    }
                })
                .then(() => {
                    messageFound.update({
                        dislike: messageFound.dislike - 1
                    })
                    .then(messageUpdated => {
                        res.status(200).json(messageUpdated)
                    })
                    .catch(err => {
                        res.status(500).json({error: err.message})
                    })
                })
                .catch(err => {
                    res.status(500).json({error: err.message})
                })
            } else if(likeFound) {
                res.status(406).json('action impossible')
            } else {
                Dislike.create({
                    usersDislikedId: userId,
                    messagesDislikedId: messageId,
                    userName: userFound.userName
                })
                .then(() => {
                    messageFound.update({
                        dislike: messageFound.dislike + 1
                     })
                     .then(messageUpdated => {
                         res.status(200).json(messageUpdated)
                     })
                     .catch(err => {
                         res.status(500).json({error: err.message})
                     })
                })
                .catch(err => {
                    res.status(500).json({error: err.message})
                })
            }
        }
    ])
};

// Table des utilisateurs qui on liké
exports.usersLikedThisMessage = (req, res) => {
    // Params
    let messageId = parseInt(req.params.messageId);

    // Getting userID
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_TOKEN);
    const userId = decodedToken.userId;

    WF.waterfall([
        function(done) {
            Like.findAll({
                where: {
                    messagesLikedId: messageId
                }
            })
            .then((likesFound) => {
                done(null, likesFound)
            })
            .catch((err) => {
              return res.status(500).json({ error: err.message });
            });
        },
        function(likesFound, done) {
            Like.findOne({
                where: {
                    messagesLikedId: messageId,
                    usersLikedId: userId
                }
            })
            .then(userFound => {
                done(null, userFound, likesFound)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
        },
        function(userFound, likesFound, done) {
            try {
                let userIsLike = ''
                let usersNameLiked = []
    
                if(userFound === null) {
                    userIsLike = false
                } else {
                    userIsLike = true
                }
                
                likesFound.forEach(like => {
                    usersNameLiked.push(like.userName)
                });
    
                res.status(200).json({
                    usersNameLiked: usersNameLiked,
                    userIsLike: userIsLike

                })  
            } catch(err) {
                res.status(500).json({error: err.message})
            }
        }
    ])

}

// Table des utilisateurs qui on disliké
exports.usersDislikedThisMessage = (req, res) => {
     // Params
     let messageId = parseInt(req.params.messageId);

     // Getting userID
     const token = req.headers.authorization.split(" ")[1];
     const decodedToken = jwt.verify(token, SECRET_TOKEN);
     const userId = decodedToken.userId;

    WF.waterfall([
        function(done) {
            Dislike.findAll({
                where: {
                    messagesDislikedId: messageId
                }
            })
            .then((dislikesFound) => {
                done(null, dislikesFound)
            })
            .catch((err) => {
              return res.status(500).json({ error: err.message });
            });
        },
        function(dislikesFound, done) {
            Dislike.findOne({
                where: {
                    messagesDislikedId: messageId,
                    usersDislikedId: userId
                }
            })
            .then(userFound => {
                done(null, userFound, dislikesFound)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
        },
        function(userFound, dislikesFound, done) {
            try {
                let userIsDislike = ''
                let usersNameDisliked = []
    
                if(userFound === null) {
                    userIsDislike = false
                } else {
                    userIsDislike = true
                }
                
                dislikesFound.forEach(dislike => {
                    usersNameDisliked.push(dislike.userName)
                });
    
                res.status(200).json({
                    usersNameDisliked: usersNameDisliked,
                    userIsDislike: userIsDislike

                })  
            } catch(err) {
                res.status(500).json({error: err.message})
            }
        }
    ])
}
