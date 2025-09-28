import express from "express"
import * as controller from "../controllers/playlist.controller.js"
import { isUserAuthorized } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isUserAuthorized);

router.route("/").post(controller.createPlaylist)

router.get("/user", controller.getUserPlaylists)

router.route("/add/:videoId/:playlistId").patch(controller.addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(controller.removeVideoFromPlaylist);
router
    .route("/:playlistId")
    .get(controller.getPlaylistById)
    .patch(controller.updatePlaylist)
    .delete(controller.deletePlaylist);

export default router


