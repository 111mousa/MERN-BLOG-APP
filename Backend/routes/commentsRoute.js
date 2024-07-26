const router = require("express").Router();
const { createCommentController, getAllCommentsController, deleteCommentController, updateCommentController } = require("../controllers/commentsController");
const { validateObjectId } = require("../middlewares/validateObjectId");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");


// /api/comments
router.route("/")
    .post(verifyToken,createCommentController)
    .get(verifyTokenAndAdmin,getAllCommentsController);            

router.route("/:id")
    .delete(validateObjectId,verifyToken,deleteCommentController)
    .put(validateObjectId,verifyToken,updateCommentController);
module.exports = router;