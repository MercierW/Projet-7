// Imports
const express = require("express");
const userCtrl = require('../ctrl/userCtrl');
const validator = require('../utils/validator');
const limitator = require('../utils/limitator');
const auth = require('../utils/jwt');
const multer = require('../utils/multer');

// Constan
const router = express.Router();

// Routes
router.post('/register', limitator.CreateAndLoginLimitor, validator.username, validator.email, validator.password, userCtrl.register);
router.post('/login', limitator.CreateAndLoginLimitor, validator.email, validator.password, userCtrl.login);
router.post('/profil/modify-password', auth, multer, validator.modifyPassword, userCtrl.modifyPassword);
router.post('/profil/modify-picture', auth, multer, userCtrl.modifyProfilPicture);

// Export
module.exports = router;