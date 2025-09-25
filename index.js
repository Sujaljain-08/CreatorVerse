import {connectDB} from './db/index.js'
import {app} from './app.js'
import cors from "cors"
import {upload} from "./middlewares/multer.middleware.js"
import { urlencoded } from 'express'

app.use(cors({origin : '*'}))
app.use(urlencoded())

connectDB().then(()=>{
    app.listen(8000, ()=>{
        console.log(`Server up and running on port 8000`);
    })
}).catch((err)=>{
    console.error("ERROR :" + err);
})

app.post("/User", upload.single('profile_pic'), (req, res)=>{
    console.log(req.file)
    res.send("hi");
})
