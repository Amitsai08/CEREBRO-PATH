import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './backend/models/Student.js';

dotenv.config({ path: './backend/.env' });

async function checkStudents() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await Student.find({}, 'name email uid academic_info');
        console.log(`Found ${students.length} students:`);
        students.forEach(s => {
            console.log(`- ${s.name} (${s.email}) UID: ${s.uid} Grade: ${s.academic_info?.class_level}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStudents();
