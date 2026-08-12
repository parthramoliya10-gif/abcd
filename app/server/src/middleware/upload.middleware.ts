import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
// Store file in memory
// Reason:
// We will directly upload buffer to storage service
// instead of saving temporary files on server.

const storage = multer.memoryStorage();
const fileFilter: multer.Options["fileFilter"] =
(
 req,
 file,
 callback,
) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];


    if(!allowedTypes.includes(file.mimetype)){

        return callback(
            new ApiError(
                400,
                "Only JPG, PNG and WEBP images are allowed",
            ),
        );

    }
    callback(null,true);

};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Generic upload
export const uploadImage = upload.single("image");

// Brand image upload
// Accepts: logo (1), banner (1), images (up to 10, gallery)
export const uploadBrandImages = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Collection image upload
// Accepts: banner (1), images (up to 10, gallery)
export const uploadCollectionImages = upload.fields([
  { name: "banner", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);