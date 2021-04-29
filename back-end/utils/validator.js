// Import
const validator = require("validator");
const passwordValidator = require("password-validator");

// Constan
const regexp = new RegExp(/[<>$'"/:={},;?]/);

// Schema du password
let schemaPassword = new passwordValidator();

schemaPassword                                                            
.has().uppercase(3)              
.has().lowercase(1)                              
.has().digits(2)                                
.has().not().spaces()                           
.has().not().symbols()                           
.is().not().oneOf(['Passw0rd', 'Password123']);

// Middleware de l'username
exports.username = (req, res, next) => {
  if (regexp.test(req.body.userName)) {
    return res.status(400).json({ error: "Le nom d'utilisateur contient des caractères invalide" });
  }
  if ((!validator.isLength(req.body.userName, { max: 15 }))) {
    return res.status(400).json({ error: "Le nom d'utilisateur doit contenir 15 caractères maximum" });
  }
  next();
};

// Middleware du password
exports.password = (req, res, next) => {
    if (!req.body.password) {
        return res.status(400).json({ error: "Le mot de passe doit contenir des caractères !" });
    }
    
    if ((!validator.isLength(req.body.password, { min: 10 }))) {
        return res.status(400).json({ error: "Le mot de passe doit faire au moins 10 caractères !" });
    }

    if (!schemaPassword.validate(req.body.password)) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 3 majuscules, 2 chiffres, 1 minuscule. Les espaces et les symboles sont interdits !" });
    }
    next();
};

// Middleware de l'email
exports.email = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ error: "L'adresse mail doit contenir un @." });
  } else if (!validator.isLength(req.body.email, { max: 30 })) {
    return res.status(400).json({ error: "Adresse email trop longue." });
  }

  if (regexp.test(req.body.email)) {
    return res.status(400).json({ error: "Email caractères invalide." });
  }
  next();
};

// Middleware de validation du nouveau mot de passe
exports.modifyPassword = (req, res, next) => {
  if (!req.body.newpass) {
    return res.status(400).json({ error: "Le mot de passe doit contenir des caractères !" });
  }

  if ((!validator.isLength(req.body.newpass, { min: 10 }))) {
      return res.status(400).json({ error: "Le mot de passe doit faire au moins 10 caractères !" });
  }

  if (!schemaPassword.validate(req.body.newpass)) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 3 majuscules, 2 chiffres, 1 minuscule. Les espaces et les symboles sont interdits !" });
  }
  next();
}