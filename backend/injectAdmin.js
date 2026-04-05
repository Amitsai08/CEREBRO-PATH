import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';

dotenv.config();

const injectAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const adminData = {
            uid: "admin", // Mock UID
            name: "Cerebro Admin",
            email: " ",
            role: "admin",
            academic_info: {
                class_level: "12th"
            }
        };

        // Upsert by email
        const result = await Student.findOneAndUpdate(
            { email: adminData.email },
            adminData,
            { upsert: true, new: true }
        );

        console.log("✅ Admin credentials injected successfully!");
        console.log("------------------------------------------");
        console.log(`Email: ${result.email}`);
        console.log(`UID: ${result.uid}`);
        console.log(`Role: ${result.role}`);
        console.log("------------------------------------------");
        console.log("Note: You can now use this email/uid in your dev environment");
        console.log("or update an existing user's role to 'admin' manually.");
        
        process.exit();
    } catch (error) {
        console.error("❌ Error injecting admin:", error.message);
        process.exit(1);
    }
};

injectAdmin();
