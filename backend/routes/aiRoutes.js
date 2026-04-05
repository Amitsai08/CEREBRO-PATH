import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * Endpoint to get the next dynamic question from Groq AI
 * POST /api/ai/next-question
 */
router.post('/next-question', async (req, res) => {
    try {
        const { studentProfile, currentAnswers, grade } = req.body;

        if (GROQ_API_KEY === 'gsk_PLACEHOLDER_ADD_YOUR_KEY_HERE' || !GROQ_API_KEY) {
            return res.status(200).json({
                isPlaceholder: true,
                message: "Groq API key is missing. Using predefined questions instead."
            });
        }

        const systemPrompt = `
            You are "Cerebro Counselor", an expert career advisor for students in Maharashtra, India.
            Your goal is to help ${grade}th grade students find their ideal career path.
            
            Based on the student's profile and previous answers, generate exactly ONE follow-up question to better understand their interests or aptitude.
            
            CONTEXT:
            - Student Grade: ${grade}th
            - Profile: ${JSON.stringify(studentProfile)}
            - Previous Answers: ${JSON.stringify(currentAnswers)}
            
            FORMAT REQUIREMENTS:
            - Return ONLY a JSON object.
            - The object must have: "question" (string) and "options" (array of exactly 4 strings).
            - Keep questions relevant to the Maharashtra education context (CET, NEET, MSBTH, streams, etc.)
            - Example: {"question": "Do you prefer working with software or hardware?", "options": ["Software", "Hardware", "Both", "Undecided"]}
        `;

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'gemma2-9b-it',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: 'Generate the next question.' }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            }
        );

        let aiData = response.data.choices[0].message.content;
        if (typeof aiData === 'string') {
            aiData = JSON.parse(aiData);
        }

        res.json(aiData);

    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(200).json({
            error: true,
            message: "AI service unavailable",
            fallback: true
        });
    }
});

/**
 * Endpoint for a quick AI Career insight
 * POST /api/ai/insight
 */
router.post('/insight', async (req, res) => {
    try {
        const { studentProfile, quizResults } = req.body;

        if (GROQ_API_KEY === 'gsk_PLACEHOLDER_ADD_YOUR_KEY_HERE' || !GROQ_API_KEY) {
            return res.json({ insight: "Add your Groq API key to see personalized AI insights here!" });
        }

        const systemPrompt = `
            Analyze this student's profile and quiz results. Provide a concise, motivating 40-word career insight tailored for a student in Maharashtra. 
            Mention a specific competitive exam or pathway.
            
            Profile: ${JSON.stringify(studentProfile)}
            Results: ${JSON.stringify(quizResults)}
        `;

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'gemma2-9b-it',
                messages: [{ role: 'system', content: systemPrompt }],
                temperature: 0.5,
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            }
        );

        res.json({ insight: response.data.choices[0].message.content.trim() });

    } catch (error) {
        res.json({ insight: "Keep exploring your interests to unlock full potential!" });
    }
});

/**
 * Endpoint for general AI career chat
 * POST /api/ai/chat
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, studentProfile } = req.body;

        if (!GROQ_API_KEY) {
            return res.json({ response: "AI features are in maintenance mode (API key missing)." });
        }

        const systemPrompt = `
            You are "Cerebro Counselor", a helpful career advisor for students in Maharashtra.
            Student Profile: ${JSON.stringify(studentProfile)}
            
            Guidelines:
            - Keep answers helpful, concise, and professional.
            - Focus on Indian education system, specifically Maharashtra (CET, streams, local colleges).
            - If asked something unrelated to education or career, politely redirect the conversation.
        `;

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'gemma2-9b-it',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        res.json({ response: response.data.choices[0].message.content.trim() });
    } catch (error) {
        const errorDetail = {
            timestamp: new Date().toISOString(),
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        };
        import('fs').then(fs => {
            fs.appendFileSync('c:\\Users\\amits\\.gemini\\antigravity\\playground\\stellar-magnetar\\career-platform\\backend\\ai_error.log', JSON.stringify(errorDetail, null, 2) + '\n');
        });
        res.status(500).json({ response: "I'm having trouble thinking right now. Please try again in a moment!" });
    }
});

export default router;
