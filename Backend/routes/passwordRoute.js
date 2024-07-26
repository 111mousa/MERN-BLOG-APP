const router = require("express").Router();
const { sendResetPasswordLinkController, getResetPasswordLinkController, resetPasswordController } = require("../controllers/passwordController");


// /api/password/reset-password-link
router.route("/reset-password-link").post(sendResetPasswordLinkController);


// /api/password/reset-password/:userId/:token
router.route("/reset-password/:userId/:token")
    .get(getResetPasswordLinkController)
    .post(resetPasswordController);
module.exports = router;