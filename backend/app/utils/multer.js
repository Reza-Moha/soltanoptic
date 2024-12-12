const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");

/**
 * Create the upload directory dynamically based on the current date.
 * @param {Object} req - The HTTP request object.
 * @returns {string} The full path to the directory.
 */
function createRoute(req) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const directory = path.join(
    __dirname,
    "..",
    "public",
    "uploads",
    year,
    month,
    day,
  );

  req.body.fileUploadPath = path.join("uploads", year, month, day); // Relative path for client
  try {
    fs.mkdirSync(directory, { recursive: true });
  } catch (err) {
    console.error("Error creating upload directory:", err.message);
    throw createError.InternalServerError("Failed to create upload directory");
  }
  console.log("directory", directory);
  return directory;
}

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (file?.originalname) {
        const filePath = createRoute(req);
        console.log("Destination Path:", req);
        console.log("filePath", filePath);
        return cb(null, filePath);
      }
      cb(createError.BadRequest("Invalid file data"));
    } catch (err) {
      console.error("Error in destination:", err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    try {
      if (file.originalname) {
        console.log("Original Filename:", file.originalname);
        const ext = path.extname(file.originalname).toLowerCase();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        req.body.filename = fileName; // Store filename in the request body for further use
        return cb(null, fileName);
      }
    } catch (error) {
      console.error("Error in filename:", error);
      cb(createError.BadRequest("Invalid file name", error));
    }
  },
});

/**
 * File filter for images
 */
function fileFilter(req, file, cb) {
  console.log("Uploaded file:", file);
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  }
  console.error("Invalid file format:", ext);
  return cb(createError.NotAcceptable("فرمت ارسال شده تصویر صحیح نمیباشد"));
}

/**
 * File filter for videos
 */
function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.NotAcceptable("فرمت ارسال شده ویدیو صحیح نمیباشد"));
}

// Define size limits
const pictureMaxSize = 10 * 1024 * 1024; // 10MB
const videoMaxSize = 300 * 1024 * 1024; // 300MB

// Multer configurations for file uploads
const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: pictureMaxSize },
  preservePath: true,
});

const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: videoMaxSize },
});

module.exports = {
  uploadFile,
  uploadVideo,
};
