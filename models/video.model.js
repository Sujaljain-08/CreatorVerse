import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,"Please add title"],
        unique: [true, "This title is already taken"]
    },
    likeCount : Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    videoFile:{
        type:String,                                    //cloudinary url
        required: [true,"Please upload video file"]
    },
    viewCount: {
        type:Number,
        default: 0
    },
    thumbnail : String,
    isPublished: {
        type: Boolean,
        required: true,
    },
    description : String,
    duration :{
        required: true,
        type: Number
    }
}, {timestamps:true})

export const Video = mongoose.model("Video", videoSchema);