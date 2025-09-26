import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncWrapper } from "../utils/asyncwrapper.js"
import { customErrors } from "../utils/errorHandler.js"

export const isUserAuthorized = asyncWrapper(async (req, res, next)=>{
    const accessToken = req.cookies.accessToken 

    if(!accessToken){
        throw new customErrors(401, "Not authorized please login again");
    }

    try {
        const result = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        
        const user = await User.findById(result._id).select("-Password -refreshToken")
        
        if(!user) {
            throw new customErrors(401, "Invalid token - user not found");
        }
        
        req.user = user;
        next();
        
    } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
            throw new customErrors(401, "Token expired - please login again");
        } else if (jwtError.name === 'JsonWebTokenError') {
            throw new customErrors(401, "Invalid token - please login again");
        } else {
            throw jwtError;
        }
    }
})