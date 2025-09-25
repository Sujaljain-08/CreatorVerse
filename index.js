import {connectDB} from './db/index.js'
import {app} from './app.js'
import { uploadOnCloudinary } from './utils/cloudinary.util.js';

connectDB().then(()=>{
    app.listen(8000, ()=>{
        console.log(`Server up and running on port 8000`);
    })
}).catch((err)=>{
    console.error("ERROR :" + err);
})

uploadOnCloudinary