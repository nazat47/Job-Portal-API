const { UnauthenticatedError } = require("../errors")
const User=require("../models/User")
const jwt=require('jsonwebtoken')
require('dotenv')

const auth=async (req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw UnauthenticatedError("Invalid request")
    }
    const token=authHeader.split(" ")[1]
    try {
        const decode= jwt.verify(token,process.env.JWT_SECRET)
        req.user={id:decode.id,name:decode.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication failed")
    }
    
}
module.exports=auth