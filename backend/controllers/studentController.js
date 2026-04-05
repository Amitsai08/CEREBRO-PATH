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
      // Create - ONLY if password is provided (unlikely during profile update)
      if (email && uid) {
          const emailCheck = await Student.findOne({ email });
          if (emailCheck) {
              emailCheck.uid = uid;
              student = await emailCheck.save();
          } else {
              // Return error instead of 500 if trying to 'create' without a password
              return res.status(404).json({ message: 'User profile not found. Please register an account first.' });
          }
      } else {
          return res.status(400).json({ message: 'Missing user identification (UID/Email).' });
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

    // Automated Prediction Logic (Enhanced Heuristic)
    const avgScore = (student.aptitude_scores.logical_score + 
                     (student.aptitude_scores.science_score || student.aptitude_scores.commerce_score)) / 2;
    
    const is12th = student.academic_info?.class_level === '12th';
    const percentile = student.academic_info?.marks_percentile || 0;
    const preferredStream = student.interests?.preferred_stream || '';
    
    let path = 'Science'; // Default
    let insight = 'Keep exploring your options based on your unique profile.';

    // Enhanced Heuristic Logic incorporating Profile Data
    if (student.aptitude_scores.science_score > 80 && student.aptitude_scores.logical_score > 80) {
        path = is12th ? 'Engineering' : 'Science';
        insight = `Strong ${path} profile. With a ${percentile}% percentile, you have excellent chances in top-tier institutions.`;
    } else if (student.aptitude_scores.science_score > 70 && student.aptitude_scores.reaction_score > 70) {
        path = is12th ? 'Medical' : 'Science';
        insight = 'Strong life sciences aptitude. Your interest in health-sector fits your profile well.';
    } else if (student.aptitude_scores.commerce_score > 70 || preferredStream === 'Commerce') {
        path = 'Commerce';
        insight = 'Analytical business metrics detected. Professional courses like CA/CS are highly recommended.';
    } else if (student.aptitude_scores.creativity_score > 80) {
        path = 'Arts/Design';
        insight = 'Exceptional creativity metrics. Consider high-end design or humanities pathways.';
    } else if (avgScore < 60 && percentile > 70) {
        path = 'Diploma / Vocational';
        insight = 'Your profile suggests a practical, skill-oriented pathway like specialized Diploma programs.';
    }

    // Groq AI Override for absolute accuracy (Forecasting based on Profile + Test)
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'gsk_PLACEHOLDER_ADD_YOUR_KEY_HERE') {
        try {
            const aiPrompt = `
            Analyze this student's combined profile for career forecasting:
            - Aptitude: Logic=${student.aptitude_scores.logical_score}, Science=${student.aptitude_scores.science_score}, Commerce=${student.aptitude_scores.commerce_score}, Creativity=${student.aptitude_scores.creativity_score}
            - Academic: Class=${student.academic_info?.class_level}, Percentile=${percentile}%, Subjects=${student.academic_info?.subjects?.join(', ')}
            - Interests: Preferred Stream=${preferredStream}
            
            Return exactly ONE label from this list strictly: [Science, Commerce, Arts, Engineering, Medical, Diploma, Fine Arts/Vocational]. No quotes.
            
            IMPORTANT: Also produce a warm, extremely supportive, and motivating 1-sentence career insight for this student. Avoid phrases like "have not yet explored". Focus on their potential.`;

            const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: aiPrompt }],
                temperature: 0.6,
                max_tokens: 60
            }, { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 4000 });
            
            const aiOutput = aiRes.data.choices[0].message.content.trim();
            // Try to separate label from sentence if AI combines them (heuristic)
            const allowedLabels = ["Science", "Commerce", "Arts", "Engineering", "Medical", "Diploma", "Fine Arts/Vocational"];
            const words = aiOutput.split(/\n| /);
            const foundLabel = words.find(w => allowedLabels.includes(w.replace(/[.,]/g, '')));
            
            if (foundLabel) {
                path = foundLabel;
                insight = aiOutput.replace(foundLabel, '').trim() || `Forecasting metrics suggest ${path} is a fantastic destination for your unique talents!`;
                if (insight.length < 10) insight = `With your profile, you have a bright future in ${path}—keep pushing toward your goals!`;
            }
        } catch (e) {
            console.error("Forecasting AI failure, falling back to heuristic", e.message);
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
