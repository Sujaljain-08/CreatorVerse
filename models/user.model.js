import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required: true,
    },
    username:{
        type:String,
        required: true,
        unique: [true, "this username is already taken"],
        index: true
    },
    email:{
        type : String,
        required : true,
        unique: [true, " email already in use"]
    },
    Password:{
        type:String,
        required:[true, "password is required"]
    },
    coverImage:{
        type:String
    },
    watchHistory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    avatar: String,
    refreshToken: String
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("Password"))  return next();
    this.Password = await bcrypt.hash(this.Password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(pass){
    return bcrypt.compare(pass, this.Password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_DURATION || '1d'
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_DURATION || '10d'
        }
    )
}

export const User = mongoose.model("User", userSchema);