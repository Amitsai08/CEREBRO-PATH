import axios from 'axios';

const testAI = async () => {
    try {
        console.log("Testing AI Chat endpoint...");
        const res = await axios.post('http://localhost:5000/api/ai/chat', {
            message: "Hello",
            studentProfile: { name: "Test Student" }
        });
        console.log("Response:", res.data);
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
    }
};

testAI();
