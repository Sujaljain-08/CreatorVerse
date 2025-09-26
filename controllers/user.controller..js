import { asyncWrapper } from "../utils/asyncwrapper.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.util.js"
import { customErrors } from "../utils/errorHandler.js";

export const registerUser = asyncWrapper( async (req, res) => {
    const { fullName, username, email, Password } = req.body;

    if(!fullName  || !username ||  !email || !Password){
        throw new customErrors(400, " All fields are required")
    }

    let result = [fullName, username, email, Password].filter((field) => field.trim() === "")

    if (result.length != 0) {
        return res.status(400).send("NO field should be empty");
    }

    let user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (user) {
        return res.status(409).send(`Username : ${username} or email : ${email} already in use`);
    }

    let { avatar, coverImage } = req.files

    if (!avatar) {
        throw new customErrors(400, "Please add avatar");
    }

    const avatarLocalPath = req.files.avatar[0].path;
    let coverImageLocalPath = "";

    if (coverImage) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    let coverImageCloudUrl = "";
    if (coverImageLocalPath) {
        coverImageCloudUrl = await uploadOnCloudinary(coverImageLocalPath)
    }

    let avatarCloudUrl = await uploadOnCloudinary(avatarLocalPath)

    const newUser = await User.create({
        fullName,
        email,
        username,
        Password,
        avatar: avatarCloudUrl,
        coverImage: coverImageCloudUrl ? coverImageCloudUrl : ""
    })

    let createdUser = await User.findById(newUser._id).select("-Password -refreshToken -watchHistory")

    res.send(createdUser);
})

export const loginUser = asyncWrapper( async (req, res) => {

    let { username, Password, email } = req.body

    if(!username && !email){
        return res.status(400).send({message : "Please enter username or email"})
    }

    let user = await User.findOne({
        $or: [{ username }, { email }]
    })
    
    if(!user){
       throw new customErrors(401, "No user with given username or email")
    }

    let result = user.isPasswordCorrect(Password)

    if(!result){
        throw new customErrors(401, "Invalid Password")
    }

    let accessToken = user.generateAccessToken();

    let refreshToken = user.generateRefreshToken();

    const options = {
        httpOnly : true,
        secure : true
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })

    res.cookie("refreshToken", refreshToken, options)
       .cookie("accessToken", accessToken, options)
       .send({message: "success", accessToken})
})

export const logoutUser = asyncWrapper( async(req, res)=>{
    let user = req.user
    
    await User.findByIdAndUpdate(
        user._id, 
        {
            $set : {refreshToken : undefined}
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    res.clearCookie("refreshToken", options)
       .clearCookie("accessToken", options)
       .status(200)
       .json({message: "User logged out successfully"})
})
