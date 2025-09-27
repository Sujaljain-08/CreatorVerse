import express from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { isUserAuthorized } from "../middlewares/auth.middleware.js";

const Router = express.Router();

import * as controller from "../controllers/user.controller..js"

Router.post("/register", upload.fields(
    [{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]
), controller.registerUser);

Router.post("/login", upload.none(), controller.loginUser);

Router.get("/logout", isUserAuthorized, controller.logoutUser);

Router.get("/refresh", controller.refreshToken_endpoint);

Router.post("/changePassword",upload.none(), isUserAuthorized, controller.changePassword);

Router.patch("/updateDetails", upload.single("avatar"), isUserAuthorized, controller.updateDetails )

export default Router;

