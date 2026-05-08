import multer from "multer";
import { cloudinary } from "../config/cloudnery";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const productStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const uploadProduct = multer({
    storage: productStorage,
    limits: { fileSize: 3 * 1024 * 1024 },
});

export default uploadProduct;