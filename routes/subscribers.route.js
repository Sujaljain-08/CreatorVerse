import express from "express"
import * as controller from "../controllers/subscriber.controller.js"

const Router = express.Router();

Router.get("/toggleSubscribe", controller.toggleSubscription)