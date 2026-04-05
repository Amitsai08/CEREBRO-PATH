import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log("🚀 Starting Comprehensive Endpoint Test...");
    let results = [];

    const testCase = async (name, method, url, data = null) => {
        try {
            console.log(`Testing [${method}] ${url}...`);
            const config = { method, url: `${API_URL}${url}` };
            if (data) config.data = data;
            const res = await axios(config);
            results.push({ name, status: 'PASS', code: res.status });
            return res.data;
        } catch (err) {
            results.push({ name, status: 'FAIL', code: err.response?.status || err.message });
            return null;
        }
    };

    // 1. Student Routes
    const testUid = `test_uid_${Date.now()}`;
    await testCase('Create Student', 'post', '/students', {
        uid: testUid,
        email: `test_${Date.now()}@example.com`,
        name: "Test Student",
        academic_info: { class_level: '10th' }
    });
    await testCase('Get Student', 'get', `/students/${testUid}`);
    await testCase('Save Questionnaire', 'post', `/students/${testUid}/questionnaire`, {
        answers: { q1: 'Engineering', q2: 'Math' }
    });
    await testCase('Update Aptitude', 'put', `/students/${testUid}/aptitude`, {
        logical_score: 85,
        science_score: 90
    });

    // 2. College Routes
    await testCase('Get Colleges', 'get', '/colleges?limit=1');

    // 3. AI Routes
    await testCase('AI Next Question', 'post', '/ai/next-question', {
        grade: '10th',
        currentAnswers: []
    });
    await testCase('AI Insight', 'post', '/ai/insight', {
        studentProfile: { name: "Test" }
    });
    await testCase('AI Chat', 'post', '/ai/chat', {
        message: "Hello"
    });

    console.log("\n📊 TEST RESULTS SUMMARY:");
    console.table(results);

    const failures = results.filter(r => r.status === 'FAIL');
    if (failures.length > 0) {
        console.log(`❌ ${failures.length} tests failed.`);
    } else {
        console.log("✅ All systems go!");
    }
}

testEndpoints();
