const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken (req,res,next){
    const authToken = req.headers.authorization;
    if(authToken){
        const token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decodedPayload;
            next();
        } catch (error) {
            return res.status(401).json({message:"invalid token , access denied"});
        }
        
    }else{
        res.status(401).json({message:"no token provided , access denied"})
    }
};

function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(!req.user.isAdmin){
            return res.status(403).json({message:"not allowed , only admin"});
        }
        next();
    })
};

function verifyTokenAndOnlyUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id !== req.params.id){
            return res.status(403).json({message:"not allowed , only user himself"});
        }
        next();
    })
};

// verify token & authorization
function verifyTokenAndAuthorization(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"not allowed , only user himself"});
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization
}