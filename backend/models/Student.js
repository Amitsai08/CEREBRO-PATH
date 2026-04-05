import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Custom internal UID constraint preserved
    password: { type: String, required: true }, // JWT Auth Password
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    district: { type: String },
    category: { type: String }, // Open, OBC, SC, ST etc

    academic_info: {
        class_level: { type: String, enum: ['10th', '12th'], required: true },
        marks_percentile: { type: Number },
        subjects: [String], // Mostly for 12th (PCM, PCB, Commerce, Arts)
        is_fyjc_registered: { type: Boolean, default: false },
        fyjc_registration_number: { type: String },
        college_type_preference: { type: String, enum: ['Aided', 'Unaided', 'Government', 'Any'], default: 'Any' }
    },

    interests: {
        preferred_stream: { type: String }, // Can be recommended or self-selected
        career_interests: [String] // e.g. Data Scientist, CA, UI/UX
    },

    aptitude_scores: {
        logical_score: { type: Number, default: 0 },
        analytical_score: { type: Number, default: 0 },
        creativity_score: { type: Number, default: 0 },
        reaction_score: { type: Number, default: 0 },
        science_score: { type: Number, default: 0 },
        commerce_score: { type: Number, default: 0 }
    },

    prediction: {
        recommended_path: { type: String },
        confidence_score: { type: Number },
        insights: { type: String }
    },

    preferences: {
        preferred_location: { type: String },
        preferred_districts: [{ type: String }],
        preferred_colleges: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College'
        }],
        budget_range: { type: String }
    }
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
