import express from 'express';
import { getColleges, getCollegeById } from '../controllers/collegeController.js';

const router = express.Router();

router.get('/', getColleges);
router.get('/:id', getCollegeById);

export default router;
