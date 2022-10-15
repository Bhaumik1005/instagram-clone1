import { Router } from "express";
import {
          validateRegisterUser,
          validateUserLogin,
          validateUpdatedData,
          validateForgotPassword,
          validateResetPassword,
} from "../../middlewares/validation";
import userAuthController from "../controllers/userController";
import { multer1, Multer1 } from "../../middlewares/uploadProfile";
import passport from "passport";
import multer from "multer";

require("../../middlewares/passport");


const upload = multer();
const router = Router();



// //[user Register Route]
// router.post("/signup", multer1, validateRegisterUser, userAuthController.signup);

router.get('/user', userAuthController.user);


module.exports = router;