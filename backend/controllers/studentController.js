import Student from '../models/Student.js';
import generateToken from '../utils/generateToken.js';
import axios from 'axios';

// @desc    Get student profile by Firebase UID
// @route   GET /api/students/:uid
export const getStudentByUid = async (req, res) => {
  try {
    const student = await Student.findOne({ uid: req.params.uid }).populate('preferences.preferred_colleges');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({
      ...student.toObject(),
      token: generateToken(student._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/students/login
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({ message: 'No account found. Please sign up first.' });
    }

    // Handle old accounts that were created before JWT migration (no password)
    if (!student.password) {
      return res.status(401).json({ message: 'This account needs to be re-registered. Please use Sign Up.' });
    }

    const isMatch = await student.matchPassword(password);
    if (isMatch) {
      res.json({
        _id: student._id,
        uid: student.uid,
        name: student.name,
        email: student.email,
        role: student.role,
        academic_info: student.academic_info,
        aptitude_scores: student.aptitude_scores,
        prediction: student.prediction,
        interests: student.interests,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Register a new student
// @route   POST /api/students/register
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const studentExists = await Student.findOne({ email });
    
    // If account exists but has no password (pre-JWT migration), update it
    if (studentExists && !studentExists.password) {
      studentExists.password = password;
      studentExists.name = name || studentExists.name;
      await studentExists.save();
      return res.status(201).json({
        _id: studentExists._id,
        uid: studentExists.uid,
        name: studentExists.name,
        email: studentExists.email,
        role: studentExists.role,
        academic_info: studentExists.academic_info,
        token: generateToken(studentExists._id),
      });
    }
    
    if (studentExists) {
      return res.status(400).json({ message: 'Account already exists. Please login instead.' });
    }

    // Generate custom internal UID for backward compatibility
    const uid = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const student = await Student.create({
      uid,
      name,
      email,
      password,
      role: role || 'student',
      academic_info: { class_level: '10th' } // default
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        uid: student.uid,
        name: student.name,
        email: student.email,
        role: student.role,
        token: generateToken(student._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create or update student profile (Legacy profile update)
// @route   POST /api/students
export const createOrUpdateStudent = async (req, res) => {
  try {
    const { uid, name, email, district, category, academic_info, interests, aptitude_scores, preferences } = req.body;
    
    let student = await Student.findOne({ uid });
    
    // If not found by UID, check if email is already taken by ANOTHER record
    if (!student && email) {
      const existingByEmail = await Student.findOne({ email });
      if (existingByEmail) {
        // If we found someone by email, we should probably update THEIR uid to match
        // to keep it consistent with the frontend's mock UID logic
        student = existingByEmail;
        student.uid = uid;
      }
    }

    if (student) {
      // Update
      student.name = name || student.name;
      student.email = email || student.email;
      student.district = district || student.district;
      student.category = category || student.category;
      
      if (academic_info) {
        const currentAcademic = student.academic_info ? student.academic_info.toObject() : {};
        student.academic_info = { ...currentAcademic, ...academic_info };
      }
      if (interests) {
        const currentInterests = student.interests ? student.interests.toObject() : {};
        student.interests = { ...currentInterests, ...interests };
      }
      if (aptitude_scores) {
        const currentAptitude = student.aptitude_scores ? student.aptitude_scores.toObject() : {};
        student.aptitude_scores = { ...currentAptitude, ...aptitude_scores };
      }
      if (preferences) {
        const currentPrefs = student.preferences ? student.preferences.toObject() : {};
        student.preferences = { ...currentPrefs, ...preferences };
      }
      
      await student.save();
    } else {
      // Create - double check that email isn't taken (unlikely but safe)
      const emailCheck = await Student.findOne({ email });
      if (emailCheck) {
          // This should have been caught by the logic above, but just in case
          emailCheck.uid = uid;
          student = await emailCheck.save();
      } else {
          student = await Student.create({ uid, name, email, district, category, academic_info, interests, aptitude_scores, preferences });
      }
    }
    res.status(201).json({
      ...student.toObject(),
      token: generateToken(student._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Save questionnaire answers & update profile
// @route   POST /api/students/:uid/questionnaire
export const saveQuestionnaireResults = async (req, res) => {
  try {
    const { grade, answers, recommended_stream, recommended_courses } = req.body;
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (grade === '10th' && recommended_stream) {
      student.interests.preferred_stream = recommended_stream;
    }
    if (grade === '12th' && recommended_courses) {
      student.interests.career_interests = recommended_courses;
    }
    await student.save();
    res.json({ message: 'Questionnaire results saved', student });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update aptitude scores and generate prediction
// @route   PUT /api/students/:uid/aptitude
export const updateAptitudeScores = async (req, res) => {
  try {
    const { logical_score, analytical_score, creativity_score, reaction_score, science_score, commerce_score } = req.body;
    const student = await Student.findOne({ uid: req.params.uid });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.aptitude_scores.logical_score = logical_score ?? student.aptitude_scores.logical_score;
    student.aptitude_scores.analytical_score = analytical_score ?? student.aptitude_scores.analytical_score;
    student.aptitude_scores.creativity_score = creativity_score ?? student.aptitude_scores.creativity_score;
    student.aptitude_scores.reaction_score = reaction_score ?? student.aptitude_scores.reaction_score;
    student.aptitude_scores.science_score = science_score ?? student.aptitude_scores.science_score;
    student.aptitude_scores.commerce_score = commerce_score ?? student.aptitude_scores.commerce_score;

    // Automated Prediction Logic (Strict Categorization)
    const avgScore = (student.aptitude_scores.logical_score + 
                     (student.aptitude_scores.science_score || student.aptitude_scores.commerce_score)) / 2;
    
    const is12th = student.academic_info?.class_level === '12th';
    const hasSci = student.aptitude_scores.science_score > 0;
    
    let path = 'Science'; // Default
    let insight = 'Keep exploring your options.';

    // Base Heuristic Logic
    if (student.aptitude_scores.science_score > 80 && student.aptitude_scores.logical_score > 80) {
        path = is12th ? 'Engineering' : 'Science';
        insight = 'High logical and science aptitude points heavily toward technical fields.';
    } else if (student.aptitude_scores.science_score > 70 && student.aptitude_scores.reaction_score > 70) {
        path = is12th ? 'Medical' : 'Science';
        insight = 'Strong life sciences and reaction time suits healthcare fields.';
    } else if (student.aptitude_scores.commerce_score > 70) {
        path = 'Commerce';
        insight = 'Great business acumen detected.';
    } else if (student.aptitude_scores.creativity_score > 80 && student.aptitude_scores.logical_score < 60) {
        path = 'Arts';
        insight = 'Your creativity metrics are off the charts. Consider design or humanities.';
    } else if (student.aptitude_scores.logical_score < 50 && student.aptitude_scores.science_score < 50) {
        path = 'Fine Arts/Vocational';
        insight = 'Your profile is highly unique and practical.';
    } else if (avgScore > 50 && avgScore < 70) {
         path = 'Diploma';
         insight = 'A practical diploma might be the fastest track to a stable career for your profile.';
    }

    // Groq AI Override for absolute accuracy (if API key provided)
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'gsk_PLACEHOLDER_ADD_YOUR_KEY_HERE') {
        try {
            const aiPrompt = `Analyze scores: Logic=${student.aptitude_scores.logical_score}, Science=${student.aptitude_scores.science_score}, Commerce=${student.aptitude_scores.commerce_score}, Creativity=${student.aptitude_scores.creativity_score}. Class: ${student.academic_info?.class_level}. 
            Return exactly ONE label from this list strictly based on best fit: [Science, Commerce, Arts, Engineering, Medical, Diploma, Fine Arts/Vocational]. No quotes or extra text.`;

            const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'gemma2-9b-it',
                messages: [{ role: 'user', content: aiPrompt }],
                temperature: 0.2, // Low temp for strict adherence
                max_tokens: 15
            }, { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 4000 });
            
            const aiLabel = aiRes.data.choices[0].message.content.trim().replace(/['"]/g, '');
            const allowedLabels = ["Science", "Commerce", "Arts", "Engineering", "Medical", "Diploma", "Fine Arts/Vocational"];
            
            if (allowedLabels.includes(aiLabel)) {
                path = aiLabel;
                insight = 'Powered by highly accurate Groq AI profiling.';
            }
        } catch (e) {
            console.error("Groq Aptitude failure, falling back to heuristic", e.message);
        }
    }

    student.prediction = {
        recommended_path: path,
        confidence_score: Math.round(avgScore),
        insights: insight
    };

    await student.save();
    res.json({ 
        message: 'Aptitude scores and prediction updated', 
        aptitude_scores: student.aptitude_scores,
        prediction: student.prediction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
