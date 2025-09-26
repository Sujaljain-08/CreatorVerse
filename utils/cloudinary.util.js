import { v2 as cloudinary } from 'cloudinary'
import fs from "node:fs"
import { customErrors } from './errorHandler.js';

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

    fs.unlinkSync(localFilePath);
     
    return response.url

  }catch(err){
    fs.unlinkSync(localFilePath);
    throw new customErrors(500, `failed upload on cloudinary of ${localFilePath}`)
  }
}