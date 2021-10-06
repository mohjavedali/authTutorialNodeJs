const express = require("express");
const router = express.Router();
const createError = require('http-errors')
const User = require("../Models/User.model");
const {authSchema} = require('../helpers/validation_schema');
const {signAccessToken, verifyRefreshToken, signRefreshToken} = require("../helpers/jwt.helper");


router.post('/register', async (req, res, next)=>{
    try {
       // const {email, password} = req.body;
        //if(!email || !password) throw createError.BadRequest()
        const result = await authSchema.validateAsync(req.body)
        //console.log(result);
        //console.log(result.email);

        const doesExit = await User.findOne({email: result.email})

        if(doesExit) 
            throw createError.Conflict(`${result.email} is already been register.`)

        //const user = new User({email, password})
        const user = new User(result)
        const savedUser = await user.save();
        //console.log(savedUser);
        //console.log(savedUser.id);
        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id)
        //console.log(accessToken);
        res.send({accessToken, refreshToken});
        
    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error)
    }
})
router.post('/login', async (req, res, next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email:result.email})
        if(!user) throw createError.NotFound("User not register.");
        const isMatch = await user.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized("Username / Password not valid.");
        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({accessToken, refreshToken})

    } catch (error) {
        if(error.isJoi === true) 
        return next(createError.BadRequest("Invalid username/password"))
        next(error)
    }
})
router.post('/refresh-token', async (req, res, next)=>{
    try {
        if(!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken (refreshToken)
        const accessTokens =await signAccessToken(userId)
        const refreshTokens =await signRefreshToken(userId)
        res.send({accessTokens, refreshTokens})
    } catch (error) {
        next(error)
    }
})
router.delete('/logout', async (req, res, next)=>{
    res.send("logout route");
})



module.exports = router