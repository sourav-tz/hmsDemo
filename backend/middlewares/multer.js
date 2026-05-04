const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Bug fix by Ravi: Bug 24 - No file type or size validation; any file accepted risking disk abuse
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'), false);
  }
};

// Bug fix by Ravi: Bug 24 - Added 5MB file size limit to prevent DoS via disk filling
module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single("file");
