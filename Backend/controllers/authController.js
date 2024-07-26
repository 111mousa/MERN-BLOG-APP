const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User,validateRegisterUser,validateLoginUser } = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


/**
 * @desc   Register New User
 * @route  /api/auth/register
 * @method POST
 * @access public
 */
module.exports.registerUserController = asyncHandler(async (req,res) => {
    const { error } = validateRegisterUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({message:"user is already exist"});
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt);

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    await user.save();
    
    // Creating New VerificationToken $ Save It To DB
    const verificationToken = new VerificationToken({
        userId: user?._id,
        token: crypto.randomBytes(32).toString("hex"),
    });

    await verificationToken.save();

    // Making The Link

    const link = `${process.env.CLIENT_DOMAIN}/users/${user?._id}/verify/${verificationToken?.token}`;

    // Putting The Link Into An Html Template

    const htmlTemplate = `
    <div>
        <p>Click on the link below to verify your email</p>
        <a href="${link}">Verify</a>
    </div>`;
    
    // Sending Email To The User

    await sendEmail(user.email,"Verify Your Email",htmlTemplate);
    // Response To The Client
    
    
    res.status(201).json({message:"We sent you an email, please verify your email address"});
});


/**
 * @desc   Login User
 * @route  /api/auth/login
 * @method POST
 * @access public
 */
module.exports.loginUserController = asyncHandler(async (req,res) => {
    const { error } = validateLoginUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    let user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({message:"invalid email or password"});
    }

    const isMatchPassword = await bcrypt.compare(req.body.password,user.password);

    if(!isMatchPassword){
        return res.status(400).json({message:"invalid email or password"});
    }


    if(!user.isAccountVerified){

        let verificationToken = await VerificationToken.findOne({userId:user?._id});

        if(!verificationToken){
            console.log("create new varification token");
            verificationToken = new VerificationToken({
                userId: user?._id,
                token: crypto.randomBytes(32).toString("hex"),
            });
            await verificationToken.save();
        }
        const link = `${process.env.CLIENT_DOMAIN}/users/${user?._id}/verify/${verificationToken?.token}`;

        // Putting The Link Into An Html Template
    
        const htmlTemplate = `
        <div>
            <p>Click on the link below to verify your email</p>
            <a href="${link}">Verify</a>
        </div>`;
        
        // Sending Email To The User
    
        await sendEmail(user.email,"Verify Your Email",htmlTemplate);

        return res.status(400).json({message:"We sent you an email, please verify your email address"});

    }

    const token = user.generateAuthToken();

    res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        username: user.username,
        token: token,
    });
});


/**
 * @desc   Verify User Account
 * @route  /api/auth/:userId/verify/:token
 * @method GET
 * @access public
 */
module.exports.verifyUserAccountController = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.userId);
    if(!user){
        return res.status(404).json({message:"invalid link"});
    }

    const verificationToken = await VerificationToken.findOne({
        userId: user?._id,
        token: req.params.token,
    });

    if(!verificationToken){
        return res.status(404).json({message:"invalid link"});
    }

    user.isAccountVerified = true;
    await user.save();

    // await verificationToken.remove();
    await VerificationToken.findOneAndDelete(verificationToken);

    res.status(200).json({message:"Your Account Verified"});
});