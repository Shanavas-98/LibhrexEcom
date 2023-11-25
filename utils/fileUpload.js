const multer = require('multer');
const path = require('path')

// Multer (file upload setup)
//creating multer instance based on destination folder
const createMulterInstance = (folderName) => {
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/images/${folderName}`);
    },
    filename: (req, file, cb) => {
        const originalname = path.parse(file.originalname);
        cb(null, `${originalname.name}_${Date.now()}${originalname.ext}`);
    },
  });

  return multer({storage: storage})
}

module.exports = createMulterInstance;