import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// create s3 instance using S3Client
// (this is how we create s3 instance in v3)
const s3 = new S3Client({
  credentials: {
    accessKeyId: "AKIAXSWPJH4OHLX47WUQ", // store it in .env file to keep it safe
    secretAccessKey: "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",
  },
  region: "us-east-2", // this is the region that you select in AWS account
});

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: "splitz-app-uploads", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

// function sanitizeFile(file, cb) {
//   // Define the allowed extension
//   const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

//   // Check allowed extensions
//   const isAllowedExt = fileExts.includes(path.extname(file.originalname.toLowerCase()));

//   // Mime type must be an image
//   const isAllowedMimeType = file.mimetype.startsWith("image/");

//   if (isAllowedExt && isAllowedMimeType) {
//     return cb(null, true); // no errors
//   } else {
//     // pass error msg to callback, which can be displaye in frontend
//     cb("Error: File type not allowed!");
//   }
// }

// our middleware
export const uploadImage = multer({
  storage: s3Storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb file size
  },
});
