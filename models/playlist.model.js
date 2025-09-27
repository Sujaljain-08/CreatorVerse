import mongoose from "mongoose"

const playlistSchema = mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    name : {
        type: String,
        required: [true, "Playlist name is required"],
        trim: true
    },
    description : {
        type: String,
        trim: true
    },
    videos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ]
},{
    timestamps:true
})

export const Playlist = mongoose.model("Playlist", playlistSchema)