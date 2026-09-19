import express from "express";

//to use this you must have to export the function
//use when multiple export from one file
import * as authController from "../controllers/auth.controllers.js"
const authRouter = express.Router();

// /api/auth/register
//just define the api, logic is in controller
authRouter.post("/register",authController.register)

//for identify every user api/auth/get-me
authRouter.get("/get-me",authController.getMe)

//for refresh token
authRouter.get("/refresh-token",authController.refreshToken)

authRouter.post("/login",authController.login)


authRouter.get("/logout",authController.logout)

authRouter.get("/logout-all",authController.logoutAll)

authRouter.post("/verify-email",authController.verifyEmail)

export default authRouter
