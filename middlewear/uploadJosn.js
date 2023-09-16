const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle JSON file upload
const jsonUpload = upload.single('jsonFile'); // 'jsonFile' should match the field name in your form
module.exports = jsonUpload;
