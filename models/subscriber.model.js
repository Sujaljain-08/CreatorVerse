import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        index : true
    },
    subscriber : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        index : true
    }
},{timestamps: true})

export const Subscriber = mongoose.model("Subscriber", subscriberSchema)

