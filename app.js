import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({origin : '*'}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
import UserRouter from "./routes/user.routes.js" 

app.use("/api/v1/User", UserRouter)

export {app};
