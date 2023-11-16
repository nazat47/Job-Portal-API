const {StatusCodes}=require('http-status-codes')
const User=require('../models/User')
require('dotenv')
const jwt=require('jsonwebtoken')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const register=async(req,res)=>{
    const user=await User.create({...req.body})
    const token=user.CreateToken()
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}
const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        throw new BadRequestError("PLease insert your mail and password")
    }
    const user=await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    console.log(isPasswordCorrect)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
    const token=user.CreateToken()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})


}
module.exports={register,login}