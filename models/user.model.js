import mongoose from "mongoose"

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
        unique: true,
    },
    Password:{
        type:String,
        required:true
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

export const User = mongoose.model("User", userSchema);