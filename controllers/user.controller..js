import { asyncWrapper } from "../utils/asyncwrapper.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary, deleteAsset } from "../utils/cloudinary.util.js"
import { customErrors } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"
import { trimValues } from "../utils/trim.util.js"
import { getPublicIdFromUrl } from "../utils/extract.util.js";
import mongoose from "mongoose";

const options = {
    httpOnly: true,
    secure: true
}

export const registerUser = asyncWrapper(async (req, res) => {
    const { fullName, username, email, Password } = req.body;

    if (!fullName || !username || !email || !Password) {
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

export const loginUser = asyncWrapper(async (req, res) => {

    let { username, Password, email } = req.body

    if (!username && !email) {
        return res.status(400).send({ message: "Please enter username or email" })
    }

    let user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new customErrors(401, "No user with given username or email")
    }

    let result = await user.isPasswordCorrect(Password)

    if (!result) {
        throw new customErrors(401, "Invalid Password")
    }

    let accessToken = user.generateAccessToken();

    let refreshToken = user.generateRefreshToken();

    const options = {
        httpOnly: true,
        secure: true
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })

    res.cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .send({ message: "success", accessToken })
})

export const logoutUser = asyncWrapper(async (req, res) => {
    let user = req.user

    await User.findByIdAndUpdate(
        user._id,
        {
            $set: { refreshToken: undefined }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .status(200)
        .json({ message: "User logged out successfully" })
})

export const refreshToken_endpoint = async (req, res) => {

    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new customErrors(401, "Invalid refresh token");
    }

    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)


        const user = await User.findById(decode._id)

        const accessToken = user.generateAccessToken();

        refreshToken = user.generateRefreshToken();

        res.cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json({ message: "refreshToken and accessToken reset successfully" })

    } catch (jwterr) {
        throw new customErrors(401, jwterr)
    }
}

export const changePassword = asyncWrapper(async (req, res) => {

    if (!req.body) {
        throw new customErrors(400, "Enter old and new Password");
    }

    let { oldPassword, newPassword } = req.body;

    let userId = req.user._id;

    let user = await User.findById(userId)

    let result = await user.isPasswordCorrect(oldPassword)

    if (!result) {
        throw new customErrors(400, "Incorrect Password")
    }

    user.Password = newPassword
    await user.save()

    res.status(201).send({ message: "Password changed Successfully" })
})

export const updateDetails = asyncWrapper(async (req, res) => {
    let updates = req.body;

    let forbidden_fields = ["Password", "refreshToken", "avatar", "coverImage", "created_at", "updated_at", "email"]

    for (const fields of forbidden_fields) {
        if (updates[fields]) {
            delete updates[fields]
        }
    }

    trimValues(updates)

    if (updates["username"]) {

        const existingUser = await User.find({ "username": updates["username"] })

        if (!existingUser) {
            throw new customErrors(400, "Username is already taken");
        }
    }

    let user = await User.findByIdAndUpdate(req.user._id, {
        $set: updates
    },
        {
            new: true
        }).select("-Password -refreshToken -coverImage -avatar -createdAt ")

    res.send(user)
})

export const updateAvatar = asyncWrapper(async (req, res) => {

    if (!req.file) throw new customErrors(400, "please upload avatar image to be updated")

    let avatarLocalPath = req.file.path

    if (!avatarLocalPath) throw new customErrors(500, "failed local upload of avatar please try later")

    let uploadedavatarUrl = getPublicIdFromUrl(req.user.avatar)

    let avatarUrl = await uploadOnCloudinary(avatarLocalPath)

    if (!avatarUrl) throw new customErrors(500, "failed upload on cloudinary, Please try later")

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatarUrl
        }
    }, {
        new: true
    }).select("-Password -refreshToken -coverImage -email -createdAt ")

    await deleteAsset(uploadedavatarUrl);

    console.log("deleted old assest from cloudinary");

    res.send(updatedUser)
})

export const getProfile = asyncWrapper(async (req, res) => {

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'subscribers',
                localField: '_id',
                foreignField: 'channel',
                as: 'subscribers'
            }
        },
        {
            $lookup: {
                from: 'subscribers',
                localField: '_id',
                foreignField: 'subscriber',
                as: 'subscribedTo'
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                }
            }
        },
        {
            $project: {
                Password: 0,
                refreshToken: 0,
                subscribers: 0,
                subscribedTo: 0
            }
        }
    ])

    if (!user || user.length === 0) {
        throw new customErrors(404, "User not found");
    }

    res.status(200).json({
        success: true,
        data: user[0]
    })
})

export const getWatchHistory = asyncWrapper(async (req, res) => {
    const [user] = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$ownerDetails"
                            }
                        }
                    },
                    {
                       $project:{
                           ownerDetails:0
                       }
                    }
                ]
            }
        },
        {
            $project: {
                watchedVideos: 1,
                _id: 0
            }
        }
    ]);

    res.status(200).json(
        res.send(user)
    );
});

