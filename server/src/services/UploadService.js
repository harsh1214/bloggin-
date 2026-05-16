import cloudinary from "../config/cloudinary.js"
import streamifier from "streamifier"
import sharp from "sharp"


const streamUpload = async (buffer, folder) => {

    const optimizedBuffer = await sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                format: "webp",
            },
            (error, result) => {
                if (result) {
                    resolve(result)
                } else {
                    reject(error)
                }
            }
        )

        streamifier.createReadStream(optimizedBuffer).pipe(stream)
    })
}

export default streamUpload