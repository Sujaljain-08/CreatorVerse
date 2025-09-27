import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        index : true,
        required : true
    },
    subscriber : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        index : true,
        required : true
    }
},{timestamps: true})

export const Subscriber = mongoose.model("Subscriber", subscriberSchema)

