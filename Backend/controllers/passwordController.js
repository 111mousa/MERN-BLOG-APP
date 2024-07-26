const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User,validateEmail,validateNewPassword } = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


/**
 * @desc   Send Reset Password Link
 * @route  /api/password/reset-password-link
 * @method POST
 * @access public
 */
module.exports.sendResetPasswordLinkController = asyncHandler( async(req,res)=>{
    // 1. Validation
    const { error } = validateEmail(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    // 2. Get the user from DB by email
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(404).json({message:"user with given email doesn`t exist!"});
    }
    // 3. Createing verification token
    let verificationToken = await VerificationToken.findOne({userId:user?._id});
    if(!verificationToken){
        verificationToken = new VerificationToken({
            userId: user?._id,
            token: crypto.randomBytes(32).toString("hex"),
        });
        await verificationToken.save();
    }
    // 4. Createing Link

    const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user?._id}/${verificationToken?.token}`;

    // 5. Createing Html Template

    const htmlTemplate = `<a href="${link}">Click here to reset your password</a>`;
    // Sending Email
    await sendEmail(user?.email,"Reset Password",htmlTemplate);

    // 6. Response To The Client
    res.status(200).json({message:"Password reset link sent to your email, Please check your inbox"});
});

/**
 * @desc   Get Reset Password Link
 * @route  /api/password/reset-password/:userId/:token
 * @method GET
 * @access public
 */
module.exports.getResetPasswordLinkController = asyncHandler( async(req,res)=>{
    const user = await User.findById(req.params.userId);
    if(!user){
        return res.status(404).json({message:"invalid link"});
    }

    const verificationToken = await VerificationToken.findOne({
        userId:user?._id,
        token: req.params.token,
    });

    if(!verificationToken){
        return res.status(400).json({message:"invalid link"});
    }

    res.status(200).json({message:"Valid URL"});
});

/**
 * @desc   Reset Password
 * @route  /api/password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
module.exports.resetPasswordController = asyncHandler( async(req,res)=>{

    const { error } = validateNewPassword(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }

    const user = await User.findById(req.params.userId);
    if(!user){
        return res.status(400).json({message:"Invalid Link"});
    }

    const verificationToken = await VerificationToken.findOne({
        userId: user?._id,
        token: req.params.token,
    });

    if(!verificationToken){
        return res.status(400).json({message:"Invalid Link"});
    }

    if(!user.isAccountVerified){
        user.isAccountVerified = true;
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    user.password = hashedPassword;
    await user.save();

    await VerificationToken.findOneAndDelete({
        userId: user?._id,
        token: req.params.token,
    });

    res.status(200).json({message:"Password Reset Successfully , Please Login"});
});