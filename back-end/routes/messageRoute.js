// Imports
const express = require("express");
const messageCtrl = require('../ctrl/messageCtrl');
const likeAndDislikeCtrl = require('../ctrl/likeAndDislikeCtrl');
const auth = require('../utils/jwt');
const multer = require('../utils/multer');

// Constan
const router = express.Router();

// Routes
router.post('/new', auth, multer, messageCtrl.createMessage);
router.post('/response', auth, multer, messageCtrl.postResponses);
router.post('/like', auth, likeAndDislikeCtrl.like);
router.post('/dislike', auth, likeAndDislikeCtrl.dislike);
router.put('/update', auth, multer, messageCtrl.modifyMessage);
router.delete('/delete/:messageId', auth, messageCtrl.messageDeleted);
router.delete('/admin/delete-message/:messageId', auth, messageCtrl.deleteMessageFromAdmin)
router.delete('/admin/delete-response/:responseId', auth, messageCtrl.deleteResponseFromAdmin)
router.get('/all',auth, messageCtrl.getAllMessages);
router.get('/get-responses', messageCtrl.getResponses);
router.get('/usersLiked/:messageId', likeAndDislikeCtrl.usersLikedThisMessage);
router.get('/usersDisliked/:messageId', likeAndDislikeCtrl.usersDislikedThisMessage);

// Export
module.exports = router;