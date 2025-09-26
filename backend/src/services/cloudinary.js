import {v2 as cloudinary} from "cloudinary"
import fs from "fs" 

import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "sweetshop/sweets",
        })
        console.log("File is uploaded on Cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error) {
        console.log("Error while uploading file on Cloudinary ", error);
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {
    uploadImageOnCloudinary, 
}