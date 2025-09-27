import { Subscriber } from "../models/subscriber.model.js"
import { asyncWrapper } from "../utils/asyncwrapper.js"

export const toggleSubscription = asyncWrapper(async (req, res) => {

    let { channelId } = req.params

    let userId = req.user._id

    //return deleted row or null

    let WasSubscribed = await Subscriber.findOneAndDelete({
        "channel": channelId,
        "subscriber": userId
    })

    if (!WasSubscribed) {
        await Subscriber.insertOne({
            channel: channelId,
            subscriber: userId
        })

        res.json({
            "status": "success",
            "message": "Subscribed successfully"
        })
    }

    res.json({
        "status": "success",
        "message": "Unsubscribed successfully"
    })

})

export const getSubscribedChannels = asyncWrapper(async (req, res) => {
    let userId = req.user._id;

    let result = await Subscriber.aggregate([
        {
            $match: {
                subscriber: userId
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "owner",
                pipeline:[
                    {
                        $project:{
                            fullName : 1,
                            username : 1,
                            avatar : 1,
                            coverImage : 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                "channel": {
                    $first: "$owner"
                }
            }
        },{
            $project :{
                channel : 1
            }
        }
    ])

    res.send(result);
})

export const getSubscribers = asyncWrapper(async (req, res)=>{
    const subscribers = await Subscriber.aggregate([
        {
            $match : {
                channel : req.user._id
            }
        },
        {
            $lookup : {
                from : "users",
                localField: "subscriber",
                foreignField: "_id",
                as : "subscriber",
                pipeline:[
                    {
                        $project:{
                            fullName : 1,
                            avatar : 1,
                            coverImage : 1,
                            username : 1
                        }
                    }
                ]
            }
        },
        {
           $project:{
            subscriber : 1
           }
        }
    ])

    res.json(subscribers)
})