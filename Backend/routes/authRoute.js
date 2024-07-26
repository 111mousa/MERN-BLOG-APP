const router = require("express").Router();
const { registerUserController, loginUserController,verifyUserAccountController } = require("../controllers/authController");

// /api/auth/register
router.route("/register").post(registerUserController);

// /api/auth/login
router.route("/login").post(loginUserController);

// /api/auth/:userId/verify/:token
router.route("/:userId/verify/:token").get(verifyUserAccountController);

module.exports = router;