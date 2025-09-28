import express from "express"
import * as controller from "../controllers/like.controller.js"
import { isUserAuthorized } from "../middlewares/auth.middleware.js";

const Router = express.Router();

Router.post("/toggleLike/:videoId", isUserAuthorized, controller.toggleLike);

Router.get("/getLikedVideos", isUserAuthorized, controller.getAllLikedVideos)

export default Router;