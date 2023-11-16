const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
const { func } = require('joi')
require('dotenv')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide username"],
        minlength:3,
        maxlength:40,
    },
    email:{
        type:String,
        required:[true,"Please provide email"],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Email is not valid"
        ],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        minlength:6,
    },
})
userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})
userSchema.methods.CreateToken = function () {
    return jwt.sign(
      { id: this._id, name: this.name,
        email:this.email,
        password:this.password,
    },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    )
  }
userSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
  }
  
module.exports=mongoose.model("User",userSchema)