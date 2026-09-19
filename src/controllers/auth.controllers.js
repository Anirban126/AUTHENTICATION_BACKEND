import userModel from "../model/user.model.js";
import config from "../config/config.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sessionModel from "../model/session.model.js";
// import nodemailer from "nodemailer";
import { sendEmail } from "../services/email.services.js";
import { generateOtp,getOtpHtml } from "../utils/utils.js";
import optModel from "../model/otp.model.js";

export async function register(req, res) {
    // console.log(req.body);
    
    const { username, email, password } = req.body;
    
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isAlreadyRegistered) {
        //409 is a error code
        return res.status(409).json({
            message: "username or email already exits"
        })
    }
    //convert passwo
    // rd in hash

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
        
    })

    const otp = generateOtp()
    const html = getOtpHtml(otp)
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    await optModel.create({
        email,
        user: user._id,
        otpHash
    })
    // const refreshToken = jwt.sign(
    //     {
    //         id: user._id
    //     }, config.JWT_SECRET,
    //     {
    //         expiresIn: "7d"
    //     }
    // )
    // const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // const session = await sessionModel.create({
    //     user: user._id,
    //     refreshTokenHash,
    //     ip: req.ip,
    //     userAgent: req.headers["user-agent"]
    // })
    // const accessToken = jwt.sign(
    //     {
    //         id: user._id,
    //         sessionID: session.id
    //     }, config.JWT_SECRET,
    //     {
    //         expiresIn: "15m"
    //     }
    // )
    // //send http responce to store in cokkie
    // res.cookie("refreshToken", refreshToken, {
    //     //client js not read it
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000
    // });

    await sendEmail(email, "OTP Verification",`Your OTP code is ${otp}`,html);
    res.status(201).json({
        message: "user registered successfully",
        user: {
            username: user.username,
            email: user.email,
            // accessToken
            verified: user.verified
            
        }
    })

}
export async function verifyEmail(req,res){
    const {otp,email} = req.body
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpDoc = await optModel.findOne({
        email,
        otpHash
    })

    if(!otpDoc){
        return res.status(400).json({
            message :"Invalid OTP"
        })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user,{
        verified:true
    })

    await optModel.deleteMany({
        user:otpDoc.user
    })

        const refreshToken = jwt.sign(
        {
            id: user._id
        }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })
    const accessToken = jwt.sign(
        {
            id: user._id,
            sessionID: session.id
        }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )
    // //send http responce to store in cokkie
    res.cookie("refreshToken", refreshToken, {
        //client js not read it
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        message:"Email verified successfully",
        user:{
            username:user.username,
            email:user.email,
            verified: user.verified
        },
        accessToken
    })
}
export async function getMe(req, res) {
    //1. find out that how server determine who give request
    //tokens are come in our headers
    //tokens are came in http head with as bearer token
    const accesstoken = req.headers.authorization?.split(" ")[1];
    if (!accesstoken) {
        return res.status(401).json({
            message: "not registered"
        });
    }
    //match the toke with thqt secret thing
    //data of a=token come in decoded
    const decoded = jwt.verify(accesstoken, config.JWT_SECRET);
    console.log(decoded);

    const user = await userModel.findById(decoded.id);
    res.status(200).json({
        message: "user fetch successful",
        user: {
            username: user.username,
            email: user.email,
        }
    },)

}

export async function refreshToken(req, res) {

    const refToken = req.cookies.refreshToken;
    if (!refToken) {
        return res.status(401).json({
            message: "you are unauthorize"
        })
    }

    const refTokenHash =crypto.createHash("sha256").update(refToken).digest("hex");

    //checking that session expire or not
    const session = await sessionModel.findOne({
        refTokenHash,
        revoked: false
    })

    if(!session){
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }
    const decoded = jwt.verify(refToken, config.JWT_SECRET);
    const accessToken = jwt.sign(
        {
            id: decoded.id
        }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    const newRefreshToken = jwt.sign(
        {
            id: decoded.id
        }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    const newRefreshTokenHash =crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    session.refreshTokenHash = newRefreshTokenHash
    await session.save()

    res.cookie("refreshToken", newRefreshToken, {
        //client js not read it
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({
        message: "AccessToken generate sucesfully",
        accessToken
    })
}

export async function login(req,res){

    const {email,password} = req.body 
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    if(!user.verified){
        return res.status(401).json({
            message: "Email not verfied"
        })
    }

    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");
    const isPassValid = hashedPass === user.password;
    if(!isPassValid){
        return res.status(401).json({
            message:"Invalid email or PassWord"
        })
    }

    const refreshToken = jwt.sign(
        {
            id: user._id
        }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign(
        {
            id: user._id,
            sessionID: session.id
        }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )
    res.cookie("refreshToken", refreshToken, {
        //client js not read it
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(200).json({
        message: "Logged in succcessfully",
        user: {
            username : user.username,
            email: user.email
        },
        accessToken,
    })

}

export async function logout(req,res){
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        res.status(400).json({
            message:"Refresh Token Not found"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        // revoked:false
    })

    if(!session){
        return res.status(400).json({
            message: "Invalid refresh token"
        })
    }
    
    session.revoked = true;
    await session.save()
    res.clearCookie("refreshToken")
    res.status(200).json({
        message:"Looged Out succesfully"
    })
    
}

export async function logoutAll(req,res) {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({
            message:"Refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    //i generate session with same user id
    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"Looged out from all devices successfully"
    })
}