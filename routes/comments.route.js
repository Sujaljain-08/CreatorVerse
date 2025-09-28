import express from "express"
import { isUserAuthorized } from "../middlewares/auth.middleware.js"
import * as controller from "../controllers/comment.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const Router = express.Router()

Router.get("/videoComments/:videoId", controller.getVideoComment)

Router.post("/addComment/:videoId", isUserAuthorized, upload.none(), controller.addCommentToVideo)

Router.patch("/updateComment/:commentId", isUserAuthorized, upload.none(), controller.updateComment)

Router.delete("/delete/:commentId", isUserAuthorized, controller.deleteComment)

export default Router