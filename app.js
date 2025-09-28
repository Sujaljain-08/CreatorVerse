import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { customErrorHandler } from "./middlewares/errorhandler.middleware.js";

const app = express();

app.use(cors({origin : '*'}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
import UserRouter from "./routes/user.routes.js" 
import SubscribeRouter from "./routes/subscribers.route.js"
import commentRouter from "./routes/comments.route.js"
import likeRouter from "./routes/like.route.js"

app.use("/api/v1/User", UserRouter)
app.use("/api/v1/Subscribe", SubscribeRouter)
app.use("/api/v1/Comment", commentRouter)
app.use("/api/v1/Like", likeRouter)
app.use(customErrorHandler);

export {app};
