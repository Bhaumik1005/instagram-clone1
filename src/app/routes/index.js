import { Router } from 'express';
import userRoutes from "./userRoutes";
import postRoutes from "./postRoutes";
import bookmarkRoutes from "./bookmarkRoutes";
import commentRoutes from "./commentRoutes";


const router = Router();

//[Using Routes]
router.use('/instagram', userRoutes);
router.use('/instagram', postRoutes);
router.use('/instagram', bookmarkRoutes);
router.use('/instagram', commentRoutes);

module.exports = router;