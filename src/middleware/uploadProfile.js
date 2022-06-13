const multer = require("multer"); //For Uploading Multipart FormData

//For Uploading Profile in Local Folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadUserProfile");
  },
  filename: async (req, file, cb) => {
    cb(null, req.body.email + "_" + "profilePic.png");
  },
});

//For Accept Profile Type
const profileType = ["image/png", "image/jpg", "image/jpeg"];

//Multr Logic
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

  limits: { fileSize: 100000000 },
}).single("profilePic");
