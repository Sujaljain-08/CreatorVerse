import { asyncWrapper } from "../utils/asyncwrapper.js";

export const registerUser = asyncWrapper( async(req, res)=>{
    res.send("At signup endpoint");
})

export const loginUser = asyncWrapper( async(req, res)=>{
    res.send("At login endpoint")
})