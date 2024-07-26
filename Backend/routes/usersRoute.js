const router = require("express").Router();
const { getAllUsersController,getUserController,updateUserProfileController,
    getUsersCountController, profilePhotoUploadController, 
    deleteUserProfileController} = require("../controllers/usersController");
const { verifyToken, verifyTokenAndAdmin,verifyTokenAndOnlyUser, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const { validateObjectId } = require("../middlewares/validateObjectId");
const photoUpload = require("../middlewares/photoUpload");

// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin,getAllUsersController);

// /api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
    .post(verifyToken,photoUpload.single("image"),profilePhotoUploadController);

// /api/users/profile/:id
router.route("/profile/:id")
    .get(validateObjectId,getUserController)
    .put(validateObjectId,verifyTokenAndOnlyUser,updateUserProfileController)
    .delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfileController);
// /api/users/count
router.route("/count")
    .get(verifyTokenAndAdmin,getUsersCountController);


module.exports = router;