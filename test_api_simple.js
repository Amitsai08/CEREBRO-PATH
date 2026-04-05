import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function singleTest() {
    const timestamp = Date.now();
    console.log("Starting single test...");
    try {
        const payload = {
            uid: `uid_${timestamp}`,
            email: `test_${timestamp}@example.com`,
            name: "Test User",
            academic_info: {
                class_level: '10th'
            }
        };
        console.log("Sending payload:", JSON.stringify(payload, null, 2));
        const res = await axios.post(`${API_URL}/students`, payload);
        console.log("RESULT SUCCESS:", res.status);
        console.log("DATA:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.log("RESULT FAILED:", err.response ? err.response.status : err.message);
        if (err.response) {
            console.log("RESPONSE DATA:", JSON.stringify(err.response.data, null, 2));
        }
    }
}

singleTest();
