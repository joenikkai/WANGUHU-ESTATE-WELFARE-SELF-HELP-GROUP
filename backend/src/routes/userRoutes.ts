import { Router } from 'express';
import multer from 'multer';
import { 
    getCurrentUser,
    updateProfilePicture, 
    updateProfilePictureFromUpload, 
    removeProfilePicture, 
    updateProfile 
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/me', authenticateToken, getCurrentUser);
router.post('/profile-picture', authenticateToken, updateProfilePicture);
router.post('/profile-picture-upload', authenticateToken, upload.single('profile_picture'), updateProfilePictureFromUpload);
router.delete('/profile-picture', authenticateToken, removeProfilePicture);
router.put('/profile', authenticateToken, updateProfile);

export default router;
