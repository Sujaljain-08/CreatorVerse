import mongoose from "mongoose"

const subcommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: [true, "Subcomment content is required"],
        trim: true
    },
    parentComment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment",
        required: true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    Video : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video",
        required: true
    }
},{
    timestamps : true
})

export const Subcomment = mongoose.model("Subcomment", subcommentSchema)