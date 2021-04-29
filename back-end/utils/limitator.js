// Import
const limitator = require("express-rate-limit");

module.exports = {
    CreateAndLoginLimitor: limitator({
        windowMs: 30 * 60 * 1000,
        max: 5,
        message: "Veuillez réessayer plus tard.",
    })
};