const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
const { cloudinaryRemoveImage,cloudinaryUploadImage,
    cloudinaryRemoveMultipleImage } = require("../utils/cloudinary");

/**
 * @desc   Get All Users Profile
 * @route  /api/users/profile
 * @method GET
 * @access private (only admin)
 */

module.exports.getAllUsersController = asyncHandler(async (req,res)=>{
    
    const users = await User.find().select('-password');
    return res.status(200).json(users);
});

/**
 * @desc   Get User Profile
 * @route  /api/users/profile/:id
 * @method GET
 * @access public
 */

module.exports.getUserController = asyncHandler(async (req,res)=>{
    
    const user = await User.findById(req.params.id).select('-password').populate("posts");
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    res.status(200).json(user);
});

/**
 * @desc   Update User Profile
 * @route  /api/users/profile/:id
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateUserProfileController = asyncHandler(async (req,res)=>{
    const { error } = validateUpdateUser(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    if(req.body.password){
        const salt = bcrypt.genSalt(10);
        req.body.password = bcrypt.hash(req.body.password,salt);
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set:{
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio
    }},{new : true}).select('-password').populate("posts");

    res.status(200).json(updatedUser);
});

/**
 * @desc   Get Users Count
 * @route  /api/users/count
 * @method GET
 * @access private (only admin)
 */

module.exports.getUsersCountController = asyncHandler(async (req,res)=>{
    const count = await User.countDocuments();
    return res.status(200).json(count);
});

/**
 * @desc   Profile Photo Upload
 * @route  /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in user)
 */

module.exports.profilePhotoUploadController = asyncHandler(async (req,res) => {
    // 1. validation
    if(!req.file){
        return res.status(400).json({ message : "no file provided" });
    }
    // 2. get the path to the image
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
    // 3. upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath);
    // 4. get the user from database
    const user = await User.findById(req.user.id);
    // 5. delete the old profilephoto if exist
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    
    if(user.profilePhoto.publicId !== null){
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
    // 6. change the profilephoto field in the DB
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
    }

    await user.save();
    // 7. send response to client
    res.status(200).json({message:"your profile photo uploaded successfully",
        profilePhoto:{ url: result.secure_url,publicId: result.public_id }
    });
    // 8. remove image from the server
    fs.unlinkSync(imagePath);
});

/**
 * @desc   Delete User Profile(Account)
 * @route  /api/users/profile/:id
 * @method DELETE
 * @access private (only admin or user himself)
 */
module.exports.deleteUserProfileController = asyncHandler(async(req,res)=>{
    // 1. Get the user from DB
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({ message : "user not found" });
    }
    // 2. Get all posts from DB
    const posts = await Post.find({ user:user._id});
    // 3. Get the public ids from the posts
    const publicIds = posts?.map((post)=> post.image.publicId);
    // 4. Delete all posts image from cloudinary that belong to this user
    if( publicIds?.length > 0 ){
        await cloudinaryRemoveMultipleImage(publicIds);
    }

    if(user.profilePhoto.publicId !== null){
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
    // 5. Delete the profile picture from cludinary
    // 6. Delete user posts & comments
    await Post.deleteMany({ user : user._id });
    await Comment.deleteMany({ user : user._id });
    // 7. Delete the user himself
    await User.findByIdAndDelete(req.params.id);
    // 8. send the response to the client
    res.status(200).json({message : "your profile has been deleted"});
});