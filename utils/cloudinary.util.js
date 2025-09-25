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

    const response = await cloudinary.uploader
      .upload(localFilePath, {
        resource_type: "auto",
      })
     
    return response.url

  }catch(err){
    fs.unlinkSync(localFilePath);
    console.error("Failed file upload to cloudinary ");
    return null;
  }
}