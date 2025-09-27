// it stores likes of a video

import mongoose from "mongoose"

const likeSchema = mongoose.Schema({
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"User",
    },
    LikedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    Video : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video",
        required: true
    }
},{
    timestamps:true
})

export const Like = mongoose.model("Like", likeSchema)

