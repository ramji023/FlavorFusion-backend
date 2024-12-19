import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

//now define the function for uploading files on cloudinary from server
const uploadOnCloudinary = async function (localFilePath, folderPath) {
    try {
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
                folder: folderPath,
            }
        )
        // console.log(uploadResult);
        fs.unlinkSync(localFilePath);
        return uploadResult;
    } catch (err) {
        fs.unlinkSync(localFilePath);
        return null;
    }

}

export { uploadOnCloudinary };