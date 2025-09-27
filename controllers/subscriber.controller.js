import {User} from "../models/user.model.js"
import { Subscriber } from "../models/subscriber.model.js"

export const toggleSubscription = asyncwrapper (async (req,res)=>{
    let {channelId} = req.params
    
    let userId = req.user._id
    
    //return deleted row or null

    let WasSubscribed = await Subscriber.findOneAndDelete({
        channel : channelId,
        subscriber : userId
    })

    if(!WasSubscribed){
        let result = await Subscriber.insertOne({
            channel : channelId,
            subscriber : userId 
        })

        res.json({"status" : "success",
            "message":"Subscribed successfully"
        })
    }
    
    res.json({
        "status":"success",
        "message" : "Unsubscribed successfully"
    })
    
})

export const getSubscribedChannels = (req, res)=>{
    
}