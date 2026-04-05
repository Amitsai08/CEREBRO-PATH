import axios from 'axios';

async function testApi() {
  try {
    const res = await axios.put('https://cerebro-path-api.onrender.com/api/students/student_amitsai08/aptitude', {
      logical_score: 50,
      science_score: 50,
      commerce_score: 50
    });
    console.log('Success:', res.data);
  } catch (error) {
    if (error.response) {
      console.error('Error from server:', error.response.status, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

testApi();
