import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import axios from 'axios';
import College from '../models/College.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * Handle PDF Upload and Extraction
 * POST /api/admin/upload-pdf
 */
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Parse PDF to text
        const data = await pdf(req.file.buffer);
        const rawText = data.text;

        // Truncate to avoid token limits (approx 3000 chars for a sample chunk)
        // In a production app, we would chunk and process in a loop.
        const textToProcess = rawText.substring(0, 6000); 

        if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_PLACEHOLDER_ADD_YOUR_KEY_HERE') {
            return res.status(200).json({
                message: "PDF parsed, but Groq key is placeholder. Showing sample extracted text.",
                rawText: rawText.substring(0, 500) + "..."
            });
        }

        const systemPrompt = `
            You are a Data Extraction Assistant. 
            Extract structured college information from the provided text which is an admission seat matrix or college list.
            
            EXTRACT THE FOLLOWING FIELDS:
            - college_name
            - institute_code
            - district
            - type (e.g., Engineering, Medical, Pharmacy)
            - courses: An array of { course_name, seat_intake, previous_cutoff (if available) }
            
            FORMAT: Return ONLY a JSON object with a key "colleges" containing an array of records.
            If data is missing for a field, provide a reasonable guess or null.
        `;

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama3-70b-8192',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `TEXT TO PROCESS:\n${textToProcess}` }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        let extractedData = response.data.choices[0].message.content;
        if (typeof extractedData === 'string') {
            extractedData = JSON.parse(extractedData);
        }

        res.json({
            message: "Data extracted successfully",
            count: extractedData.colleges?.length || 0,
            colleges: extractedData.colleges || []
        });

    } catch (error) {
        console.error("PDF Processing Error:", error.message);
        res.status(500).json({ message: "Error processing PDF", error: error.message });
    }
});

/**
 * Bulk Save Colleges
 * POST /api/admin/bulk-save
 */
router.post('/bulk-save', async (req, res) => {
    try {
        const { colleges } = req.body;
        if (!colleges || !Array.isArray(colleges)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        let inserted = 0;
        let updated = 0;

        for (const college of colleges) {
            const result = await College.updateOne(
                { institute_code: college.institute_code },
                { $set: college },
                { upsert: true }
            );
            if (result.upsertedCount) inserted++;
            else if (result.modifiedCount) updated++;
        }

        res.json({ message: "Bulk save complete", inserted, updated });
    } catch (error) {
        res.status(500).json({ message: "Error saving data", error: error.message });
    }
});

export default router;
