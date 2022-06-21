const multer = require("multer"); //For Uploading Multipart FormData

//For Uploading Profile in Local Folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadUserPost/");
  },
  filename: async (req, file, cb) => {
    cb(null, Date.now() + "_" + req.user._id.valueOf() + "_" + "Post.png");
  },
});

//For Accept Profile Type
const profileType = ["image/png", "image/jpg", "image/jpeg"];

//Multer Logic
exports.uploadPostMulter = multer({
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
}).array("post");
