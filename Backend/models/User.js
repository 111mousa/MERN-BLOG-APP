const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

// User Schema
// And validation on database level
const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,//delete the spaces from first and last of the string
        minlength: 2,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            publicId: null,
        }
    },
    bio: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
},{
    timestamps : true ,
    toJSON: { virtuals : true },
    toObject: { virtuals : true }
});

UserSchema.virtual("posts",{
    ref: "Post",
    foreignField: "user",
    localField: "_id"
})
// Generrate Auth Token
UserSchema.methods.generateAuthToken = function(){
    return jwt.sign({id: this._id,isAdmin: this.isAdmin},process.env.JWT_SECRET);
}

// User Model
const User = mongoose.model("User",UserSchema);

// Validate Register User
// Validation on express framework level
function validateRegisterUser(obj){
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    });

    return schema.validate(obj);
};

// Validate Login User
function validateLoginUser(obj){
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
    });

    return schema.validate(obj);
};

// Validate Update User
function validateUpdateUser(obj){
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100),
        password: joi.string().trim().min(8),
        bio: joi.string(),
    });

    return schema.validate(obj);
};

// Validate Email
function validateEmail(obj){
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
    });

    return schema.validate(obj);
};

// Validate New Password
function validateNewPassword(obj){
    const schema = joi.object({
        password: joi.string().trim().min(8).required(),
    });

    return schema.validate(obj);
};

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateEmail,
    validateNewPassword,
};