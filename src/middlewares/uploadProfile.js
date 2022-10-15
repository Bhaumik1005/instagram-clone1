const multer = require('multer');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploadUserProfile')
    },

    filename: async (req, file, cb) => {
        console.log("updateddd",req.body.email);
        cb(null, req.body.email+"_"+"profilePic.png")
    }
});

const profileType = ["image/png", "image/jpg", "image/jpeg"]

exports.multer1 = multer({

    storage: storage,

    fileFilter: (req, file, cb) => {
        if (profileType.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
        }
    },

    limits: { fileSize: 100000000 }

}).single('profilePic');




