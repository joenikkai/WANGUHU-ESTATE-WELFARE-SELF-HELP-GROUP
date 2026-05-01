import { Router } from 'express';
import multer from 'multer';
import { consignProduct, getPublicListings, getMemberListings } from '../controllers/marketplaceController';
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

const uploadFields = upload.fields([
    { name: 'inspection_certificate', maxCount: 1 },
    { name: 'license_permit', maxCount: 1 }
]);

router.post('/consign', authenticateToken, uploadFields, consignProduct);
router.get('/public', getPublicListings);
router.get('/my-listings', authenticateToken, getMemberListings);

export default router;
