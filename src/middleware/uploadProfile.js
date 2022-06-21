const multer = require("multer"); //For Uploading Multipart FormData
const path = require("path"); //For used Specific Path

//For Uploading Profile in Local Folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadUserProfile/");
  },

  filename: async (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//For Accept Profile Picture Type
const profileType = ["image/png", "image/jpg", "image/jpeg"];

//Multer Logic
exports.multer1 = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    if (profileType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },

  limits: { fileSize: 5000000 },
}).single("profilePic");
