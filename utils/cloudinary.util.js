import { v2 as cloudinary } from 'cloudinary'
import fs from "node:fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      throw new Error(`No Local file corresponding to path ${localFilePath} found`)
    }

    const response = cloudinary.uploader
      .upload("dog.mp4", {
        resource_type: "auto",
      })
    
    console.log("File uploaded on cloudinary" + response.url );
    return response;
    
  }catch(err){
    fs.unlinkSync(localFilePath);
    console.error("Failed file upload to cloudinary" + err);
    return null;
  }
}