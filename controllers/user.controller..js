import { asyncWrapper } from "../utils/asyncwrapper.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.util.js"

export const registerUser = asyncWrapper( async(req, res)=>{
    const {fullName, username, email, Password} = req.body;

    let result = [fullName, username, email, Password].filter((field)=> field.trim() === "")
    
    if(result.length != 0){
        return res.status(400).send("NO field should be empty");
    }
    
    let user = await User.findOne({
       $or : [ {username}, {email}]
    })

    if( user ){
       return  res.status(401).send(`Username : ${username} or email : ${email} already in use`);
    }

    let {avatar, coverImage} = req.files
    
    if(!avatar){
       return  res.send(400).send("Avatar is required");
    }
    
    const avatarLocalPath = req.files.avatar[0].path;
    let coverImageLocalPath = "";

    if(coverImage){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    let coverImageCloudUrl = "";
    if(coverImageLocalPath){
       coverImageCloudUrl = await uploadOnCloudinary(coverImageLocalPath)
    }

    let avatarCloudUrl = await uploadOnCloudinary(avatarLocalPath)

    if(!avatarCloudUrl){
        new Error ("Failed avatar cloud upload");
    }

    const newUser = await User.create({
        fullName,
        email,
        username,
        Password,
        avatar : avatarCloudUrl,
        coverImage : coverImageCloudUrl ? coverImageCloudUrl : ""
    })
    
    let createdUser = await User.findById(newUser._id).select("-Password -refreshToken")

    res.send(createdUser);
 })

export const loginUser = asyncWrapper( async(req, res)=>{
    return res.send("At login endpoint")
})