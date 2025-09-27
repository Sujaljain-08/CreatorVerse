// it is comment on a video
//should have the ref to author of comment and channel

import mongoose from "mongoose"

const commentSchema = mongoose.Schema({
    content : {
        type: String,
        required: [true, "Comment content is required"],
        trim: true
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    }
},{
    timestamps : true
})

export const Comment = mongoose.model("Comment", commentSchema)

