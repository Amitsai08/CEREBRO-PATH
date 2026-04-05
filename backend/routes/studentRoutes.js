import express from 'express';
import { getStudentByUid, createOrUpdateStudent, saveQuestionnaireResults, updateAptitudeScores, loginStudent, registerStudent } from '../controllers/studentController.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/:uid', getStudentByUid);
router.post('/', createOrUpdateStudent);
router.post('/:uid/questionnaire', saveQuestionnaireResults);
router.put('/:uid/aptitude', updateAptitudeScores);

export default router;
