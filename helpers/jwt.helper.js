
const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken:(userId)=>{
        return new Promise((resolve, reject)=>{
            console.log(userId);
            const paylod = {
                //iss:'google.com'
                //name:"yours truly"
               // aud:userId
                //iss:"google.com"
              //  exp:new Date()
            }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "10ms",
                issuer:"google.com",
                audience: userId,
            }
            JWT.sign(paylod, secret, options, (err, token)=>{
                if(err){
                    console.log(err.message)
                    reject(createError.InternalServerError())
                } 
                resolve(token);
            })
        })
    },
    varifyAccessToken:(req, res, next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, payload)=>{
            if(err){
                // if(err.name==='JsonWebTokenError'){
                //     //return next(createError.Unauthorized())
                //     return next(createError.Unauthorized(err.message))
                // }else{
                //     return next(createError.Unauthorized(err.message))
                // }
                const message = err.name === 'JsonWebTokenError' ? 'JsonWebTokenError':err.message
                return next(createError.Unauthorized(err.message))

            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken:(userId)=>{
        return new Promise((resolve, reject)=>{
            console.log(userId);
            const paylod = {
                //iss:'google.com'
                //name:"yours truly"
               // aud:userId
                //iss:"google.com"
              //  exp:new Date()
            }
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: "1y",
                issuer:"google.com",
                audience: userId,
            }
            JWT.sign(paylod, secret, options,(err, token)=>{
                if(err){
                    console.log(err.message)
                    reject(createError.InternalServerError())
                } 
                resolve(token);
            })
        })
    },
    verifyRefreshToken:(refreshToken)=>{
        return new Promise((resolve, reject)=>{
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err, payload)=>{
                if(err) return reject(createError.Unauthorized())
                const userId = payload.aud
                
                resolve(userId)
            })
            const secret = process.env.REFRESH_TOKEN_SECRET
            
        })
    }
}