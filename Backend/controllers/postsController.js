const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { Post,validateCreatePost, validateUpdatePost } = require("../models/Post");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
const { default: mongoose } = require("mongoose");
const { title } = require("process");
const { Comment } = require("../models/Comment");


/**
 * @desc   Create New Post
 * @route  /api/posts
 * @method POST
 * @access private (only logged in user)
 */
module.exports.createPostController = asyncHandler( async(req,res) => {
    // 1. validation for image
    if(!req.file){
        return res.status(400).json({ message : "no image provided" });
    }
    // 2. validation for data
    const { error } = validateCreatePost(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    // 3. upload photo
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    // 4. create new post and save it to DB
    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id,
        image: {
            url: result.secure_url,
            publicId: result.public_id,
        }
    });
    // 5. send response to the client
    res.status(201).json(post);
    // 6. remove image from the server
    fs.unlinkSync(imagePath);
});

/**
 * @desc   Get All Posts
 * @route  /api/posts
 * @method GET
 * @access public
 */
module.exports.getAllPostController = asyncHandler( async(req,res) => {
    const POST_PER_PAGE = 3;
    const { pageNumber,category } = req.query;
    let posts;
    if(pageNumber){
        posts = await Post.find().skip((pageNumber-1)*POST_PER_PAGE)
        .limit(POST_PER_PAGE).sort({ createdAt:-1})
        .populate("user",["-password"]);
    }else if(category){
        posts = await Post.find({category:category}).sort({ createdAt:-1})
        .populate("user",["-password"]);
    }else{
        posts = await Post.find().sort({ createdAt:-1}).populate("user",["-password"]);
    }
    res.status(200).json(posts);
});

/**
 * @desc   Get Single Post
 * @route  /api/posts/:id
 * @method GET
 * @access public
 */
module.exports.getSinglePostController = asyncHandler( async(req,res) => {
    const post = await Post.findById(req.params.id).populate("user",['-password']).populate("comments");
    if(!post){
        return res.status(404).json({message:"post not found"});
    }
    res.status(200).json(post);
});

/**
 * @desc   Get Posts Count
 * @route  /api/posts/count
 * @method GET
 * @access public
 */
module.exports.getPostsCountController = asyncHandler( async(req,res) => {
    const count = await Post.countDocuments();
    res.status(200).json(count);
});

/**
 * @desc   Delete Post
 * @route  /api/posts/:id
 * @method DELETE
 * @access private (only admin and owner of the post)
 */
module.exports.deletePostController = asyncHandler( async(req,res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message:"post not found"});
    }

    if(req.user.isAdmin || req.user.id === post.user.toString()){
        await Post.findByIdAndDelete(req.params.id);
        await cloudinaryRemoveImage(post.image.publicId);
        // Delete all comments that belongs to this post
        await Comment.deleteMany({postId:post._id});
        return res.status(200).json({message:"post has been deleted successfully",postId:post._id});
    }

    res.status(403).json({message:"access denied , forbidden"});
});

/**
 * @desc   Update Post
 * @route  /api/posts/:id
 * @method PUT
 * @access private (only owner of the post)
 */

module.exports.updatePostController = asyncHandler( async( req,res ) => {

    const { error } = validateUpdatePost(req.body);

    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message:"post not found"});
    }

    if(req.user.id !== post.user.toString()){
        return res.status(403).json({message:"access denied , you are not allowed"});
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id,{$set:{
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
    }},{ new : true }).populate("user",["-password"]).populate("comments");

    res.status(200).json(updatedPost);

});

/**
 * @desc   Update Post Image
 * @route  /api/posts/update-image/:id
 * @method PUT
 * @access private (only owner of the post)
 */

module.exports.updatePostImageController = asyncHandler( async( req,res ) => {
    
    if(!req.file){
        return res.status(400).json({message: "no image provided"});
    }

    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message:"post not found"});
    }

    if(req.user.id !== post.user.toString()){
        return res.status(403).json({message:"access denied , you are not allowed"});
    }

    await cloudinaryRemoveImage(post.image.publicId);

    const imagePath = path.join(__dirname,`../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);


    const updatedPost = await Post.findByIdAndUpdate(req.params.id,{$set:{
        image:{
            url: result.secure_url,
            publicId: result.public_id,
        }
    }},{ new : true });


    res.status(200).json(updatedPost);
    fs.unlinkSync(imagePath);


});

/**
 * @desc   Toggle Like
 * @route  /api/posts/like/:id
 * @method PUT
 * @access private (only logged in user)
 */

module.exports.toggleLikeController = asyncHandler( async(req,res) => {
    let post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message:"post not found"});
    }

    const isPostAlreadyLiked = post.likes.find((user) => req.user.id === user.toString() );

    if(isPostAlreadyLiked){
        post = await Post.findByIdAndUpdate(req.params.id,{
            $pull:{ likes: req.user.id} // pull is used to remove value from array inn the mongo db
        },{ new : true });
    }else{
        post = await Post.findByIdAndUpdate(req.params.id,{
            $push:{ likes: req.user.id} // push is used to add value to array in the mongo db
        },{ new : true });
    }

    res.status(200).json(post);
});