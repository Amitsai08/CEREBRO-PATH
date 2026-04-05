import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
    college_name: { type: String, required: true },
    institute_code: { type: String, required: true, unique: true },
    district: { type: String, required: true },
    type: { type: String, enum: ['Engineering', 'Medical', 'Pharmacy', 'Diploma', 'FYJC', 'Arts', 'Commerce', 'Science'], required: true },
    courses: [{
        course_name: String,
        seat_intake: Number,
        previous_cutoff: Number // Stored as percentile or absolute marks depending on Type
    }],
    facilities: [String],
    rating: { type: Number, default: 0 }
}, { timestamps: true });

const College = mongoose.model('College', collegeSchema);
export default College;
