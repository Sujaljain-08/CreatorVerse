import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { asyncWrapper } from "../utils/asyncwrapper.js";
import { customErrors } from "../utils/errorHandler.js";

export const toggleLike = asyncWrapper(async (req, res) => {

    if (Object.keys(req.params).length === 0) {
        throw new customErrors(400, "Request parameters are required");
    }

    let { videoId } = req.params;

    if (!videoId) {
        throw new customErrors(400, "Video ID is required");
    }

    let userId = req.user._id;

    let result = await Like.findOneAndDelete({ Video: videoId, LikedBy: userId })

    if (!result) {
        let currentVideo = await Video.findById(videoId);
        await Like.insertOne({
            channel: currentVideo.owner,
            LikedBy: userId,
            Video: videoId
        })

        return res.status(200).send("Liked video succeessfully")
    }

    return res.status(201).send("Unliked video succesfully")
})

export const getAllLikedVideos = asyncWrapper(async (req, res) => {
    let videos = await Like.aggregate([
        {
            $match: {
                LikedBy: req.user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "owner",
                pipeline: [{
                    $project: {
                        "fullName": 1,
                        "username": 1,
                        "avatar": 1,
                        "coverImage": 1,
                    }
                }]
            }
        },
        {
            $addFields: {
                "channel": {
                    $first: "$owner"
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "Video",
                foreignField: "_id",
                as: "aboutVideo",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            viewCount: 1,
                            thumbnail: 1,
                            duration: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                "videoDetails":{
                    $first : "$aboutVideo"
                }
            }
        },
        {
            $project: {
                "channel": 1,
                "videoDetails":1
            }
        }
    ])

    if (!videos) {
        return res.send("no Liked videos")
    }

    res.send(videos)
})