import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncWrapper } from "../utils/asyncwrapper.js"
import { customErrors } from "../utils/errorHandler.js"

export const isUserAuthorized = asyncWrapper(async (req, res, next)=>{
    const accessToken = req.cookies.accessToken 

    if(!accessToken){
        throw new customErrors(401, "Not authorized please login again");
    }

    const result = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    if( result ){

        const user = await User.findById(result._id).select("-Password -refreshToken")
        req.user = user;
        next();

    }else{
        throw new customErrors(401, result.error)
    }
})