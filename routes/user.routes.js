import express from "express"
import { upload } from "../middlewares/multer.middleware.js"

const Router = express.Router();

import * as controller from "../controllers/user.controller..js"

Router.post("/register", upload.fields(
    [{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]
), controller.registerUser);

Router.post("/login", upload.none(), controller.loginUser);

export default Router;

