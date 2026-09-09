import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from "multer";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploaded_images', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], 
    transformation: [{ width: 800, height: 600, crop: 'limit' }] 
  }
});

// 3. Initialize Multer with Storage and File Restrictions
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

export default cloudinary;