import { Comment } from "../models/comment.model.js";
import { asyncWrapper } from "../utils/asyncwrapper.js";
import { customErrors } from "../utils/errorHandler.js";

export const getVideoComment = asyncWrapper( async(req, res)=>{
   let {videoId} = req.params;

   const comments = await Comment.find({
       "channel" : videoId
   })

   res.json(comments)
})

export const addCommentToVideo = asyncWrapper( async(req, res)=>{
    let {videoId} = req.params;

    if(!req.body) throw new customErrors(400, "comment can't be empty")

    let {content} = req.body;

    if(!content.trim) throw new customErrors(400, "comment need some text")

    console.log({
        owner : req.user._id,
        channel : videoId,
        content
    });

    let result = await Comment.insertOne({
        owner : req.user._id,
        channel : videoId,
        content
    })

    res.json(result);
})

export const updateComment = asyncWrapper ( async(req, res)=>{
    let {commentId} = req.params;

    let {newContent} = req.body;

    let comment = await Comment.findById(commentId);
    
    comment.content = newContent
    
    await comment.save()

    res.status(201).send("comment updated succesfully")
})