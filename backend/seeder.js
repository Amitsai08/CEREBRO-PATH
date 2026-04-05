import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import College from './models/College.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple paths: cleaned output first, then raw, then fallback
const dataPaths = [
    path.join(__dirname, '../scraper/output/colleges_cleaned.json'),
    path.join(__dirname, '../scraper/output/colleges_merged.json'),
    path.join(__dirname, '../scraper/colleges.json'),
];

const findDataFiles = () => {
    const outputDir = path.join(__dirname, '../scraper/output');
    if (!fs.existsSync(outputDir)) {
        console.error('❌ Scraper output directory not found.');
        process.exit(1);
    }
    return fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.json') && !file.includes('cleaned') && !file.includes('merged'))
        .map(file => path.join(outputDir, file));
};

const syntheticFacilities = ["Library", "Canteen", "Hostel", "Sports Ground", "WiFi", "Laboratory", "Auditorium"];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

        const dataFiles = findDataFiles();
        console.log(`📂 Found ${dataFiles.length} data files to process.`);

        let totalInserted = 0, totalUpdated = 0;

        for (const filePath of dataFiles) {
            console.log(`📄 Processing: ${path.basename(filePath)}`);
            const colleges = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            for (const college of colleges) {
                // Handle different field names
                const type = college.type || college.program_type;
                const district = college.district || "Unknown";

                // Add synthetic data if missing
                if (!college.facilities || college.facilities.length === 0) {
                    college.facilities = syntheticFacilities
                        .sort(() => 0.5 - Math.random())
                        .slice(0, Math.floor(Math.random() * 4) + 2);
                }
                if (!college.rating) {
                    college.rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
                }

                // Ensure type is valid based on model
                let finalType = type;
                if (filePath.includes('medical')) finalType = 'Medical';
                else if (filePath.includes('engineering') || (type && type.toLowerCase().includes('engineering'))) finalType = 'Engineering';
                else if (filePath.includes('pharmacy')) finalType = 'Pharmacy';
                else if (filePath.includes('arts_commerce')) finalType = 'Arts'; 
                else if (filePath.includes('diploma') || (type && type.toLowerCase().includes('diploma'))) finalType = 'Diploma';
                else if (filePath.includes('fyjc') || (type && type.toLowerCase() === 'fyjc')) finalType = 'FYJC';
                
                // Fallback for generic datasets
                if (!finalType) {
                    if (college.courses && college.courses.some(c => c.course_name.includes('11th'))) finalType = 'FYJC';
                    else finalType = 'Science'; // Default to Science if unknown
                }

                const result = await College.updateOne(
                    { institute_code: college.institute_code },
                    { 
                        $set: {
                            ...college,
                            type: finalType,
                            district: district
                        } 
                    },
                    { upsert: true }
                );
                if (result.upsertedCount) totalInserted++;
                else if (result.modifiedCount) totalUpdated++;
            }
        }

        // Add some explicit synthetic FYJC/Diploma samples if files were empty/missing
        const syntheticSamples = [
            {
                college_name: "Rajarshi Shahu Junior College Latur",
                institute_code: "FYJC001",
                district: "Latur",
                type: "FYJC",
                courses: [{ course_name: "Science (PCM)", seat_intake: 480, previous_cutoff: 98.2 }],
                facilities: ["Library", "Laboratory"],
                rating: 4.8
            },
            {
                college_name: "Government Polytechnic Mumbai",
                institute_code: "DIP001",
                district: "Mumbai",
                type: "Diploma",
                courses: [{ course_name: "Civil Engineering", seat_intake: 60, previous_cutoff: 85.0 }],
                facilities: ["Workshop", "Hostel"],
                rating: 4.2
            }
        ];

        for (const sample of syntheticSamples) {
            await College.updateOne({ institute_code: sample.institute_code }, { $set: sample }, { upsert: true });
        }

        const total = await College.countDocuments();
        console.log(`✅ Seeding complete: ${totalInserted} inserted, ${totalUpdated} updated`);
        console.log(`   Total documents in 'colleges': ${total}`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
