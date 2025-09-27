import express from "express"
import * as controller from "../controllers/subscriber.controller.js"
import { isUserAuthorized } from "../middlewares/auth.middleware.js";

const Router = express.Router();

Router.get("/toggleSubscribe/:channelId", isUserAuthorized, controller.toggleSubscription)

Router.get("/getSubscribedChannels", isUserAuthorized, controller.getSubscribedChannels)

Router.get("/getMySubscribers", isUserAuthorized, controller.getSubscribers)

export default Router