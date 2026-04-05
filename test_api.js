import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    const timestamp = Date.now();
    const testUsers = [
        {
            name: "New Signup (with academic_info)",
            data: {
                uid: `uid_signup_${timestamp}`,
                email: `signup_${timestamp}@test.com`,
                name: "Signup Test",
                academic_info: { class_level: '10th' }
            }
        },
        {
            name: "New Signup (MISSING academic_info - should fail if schema strict)",
            data: {
                uid: `uid_fail_${timestamp}`,
                email: `fail_${timestamp}@test.com`,
                name: "Fail Test"
            }
        }
    ];

    for (const test of testUsers) {
        console.log(`--- Running Test: ${test.name} ---`);
        try {
            const res = await axios.post(`${API_URL}/students`, test.data);
            console.log("SUCCESS:", res.status, res.data.uid);
        } catch (err) {
            console.log("FAILED:", err.response ? err.response.status : err.message);
            if (err.response && err.response.data) {
                console.log("Error details:", JSON.stringify(err.response.data, null, 2));
            }
        }
    }
}

runTests();
