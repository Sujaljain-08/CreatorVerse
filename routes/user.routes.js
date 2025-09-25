import express from "express"

const Router = express.Router();

import * as controller from "../controllers/user.controller..js"

Router.post("/register", controller.registerUser);

Router.post("/login", controller.loginUser);

export default Router;

