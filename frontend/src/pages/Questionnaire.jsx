import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const questions10th = [
  {
    id: 1,
    question: "Have you registered for the official FYJC (11th) admission process?",
    options: [
      { label: "Yes, already registered", is_registered: true },
      { label: "No, planning to do so", is_registered: false },
      { label: "Not sure about the process", is_registered: false },
    ]
  },
  {
    id: 2,
    question: "What is your preference for college funding type?",
    options: [
      { label: "Government (Lowest Fees)", college_type: "Government" },
      { label: "Aided (Subsidized Fees)", college_type: "Aided" },
      { label: "Unaided / Self-Financed", college_type: "Unaided" },
      { label: "Any (Focus on quality)", college_type: "Any" },
    ]
  },
  {
    id: 3,
    question: "Which subjects do you find most interesting?",
    options: [
      { label: "Mathematics & Logic", stream: "Science" },
      { label: "Business & Accounts", stream: "Commerce" },
      { label: "History & Languages", stream: "Arts" },
      { label: "Practical/Technical Skills", stream: "Diploma" },
    ]
  },
  {
    id: 4,
    question: "How do you prefer to spend your academic time?",
    options: [
      { label: "Solving equations and scientific experiments", stream: "Science" },
      { label: "Understanding trade, finance, and management", stream: "Commerce" },
      { label: "Reading literature and social studies", stream: "Arts" },
      { label: "Learning hands-on vocational skills", stream: "Diploma" },
    ]
  },
  {
    id: 5,
    question: "What environment do you prefer for your future career?",
    options: [
      { label: "Research labs, engineering firms, or hospitals", stream: "Science" },
      { label: "Banks, corporate offices, or stock markets", stream: "Commerce" },
      { label: "Studios, NGOs, media houses, or government", stream: "Arts" },
      { label: "Workshops, production units, or technical labs", stream: "Diploma" },
    ]
  },
];

const questions12th = [
  {
    id: 1,
    question: "What is your primary area of academic strength?",
    options: [
      { label: "Technical problem-solving & Math", course: "Engineering" },
      { label: "Biological sciences & Healthcare", course: "Medical" },
      { label: "Chemistry & Pharmaceutical theory", course: "Pharmacy" },
      { label: "Business strategy & Finance", course: "Commerce" },
      { label: "Creative arts & Social sciences", course: "Arts" },
    ]
  },
  {
    id: 2,
    question: "Which work environment appeals to you most?",
    options: [
      { label: "Tech labs, software startups", course: "Engineering" },
      { label: "Hospitals, clinics, surgery centers", course: "Medical" },
      { label: "Pharmacies, R&D labs, production", course: "Pharmacy" },
      { label: "Corporate offices, banks, stock market", course: "Commerce" },
      { label: "Studios, agencies, NGOs, media", course: "Arts" },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to spend your research time?",
    options: [
      { label: "Coding, robotics, or hardware design", course: "Engineering" },
      { label: "Studying human anatomy and diseases", course: "Medical" },
      { label: "Analyzing chemical compounds and drugs", course: "Pharmacy" },
      { label: "Market trends and financial models", course: "Commerce" },
      { label: "History, psychology, or creative writing", course: "Arts" },
    ]
  },
  {
    id: 4,
    question: "Which competition would excite you?",
    options: [
      { label: "Hackathon / Robotics Battle", course: "Engineering" },
      { label: "Medical Diagnostics Quiz", course: "Medical" },
      { label: "Drug Formulation Challenge", course: "Pharmacy" },
      { label: "B-Plan / Portfolio Management", course: "Commerce" },
      { label: "Debate / Film / Art Exhibition", course: "Arts" },
    ]
  },
  {
    id: 5,
    question: "What long-term impact do you want to make?",
    options: [
      { label: "Build technology that changes lives", course: "Engineering" },
      { label: "Save lives and improve public health", course: "Medical" },
      { label: "Develop medicines and healthcare solutions", course: "Pharmacy" },
      { label: "Manage wealth and create businesses", course: "Commerce" },
      { label: "Inspire through art, culture, and society", course: "Arts" },
    ]
  },
];

const Questionnaire = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const { user, setStudentProfile } = useAuth();
  const questions = grade === '12th' ? questions12th : questions10th;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [dynamicQuestion, setDynamicQuestion] = useState(null);
  const [useAI, setUseAI] = useState(true);

  const fetchAIQuestion = async (currentAnswers) => {
    if (!useAI) return null;
    setAiLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/next-question`, {
        studentProfile: { grade },
        currentAnswers,
        grade
      });
      
      if (res.data.isPlaceholder) {
        setUseAI(false);
        return null;
      }
      
      setDynamicQuestion(res.data);
      return res.data;
    } catch (error) {
      console.error("AI Fetch Error", error);
      setUseAI(false);
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnswer = async (option) => {
    // Save answer (handle both static and dynamic answer labels)
    const answerLabel = typeof option === 'string' ? option : option.label;
    const newAnswers = [...answers, { ...option, label: answerLabel }];
    setAnswers(newAnswers);

    if (newAnswers.length < 5) {
      // Try to get AI question for the next step
      const aiQ = await fetchAIQuestion(newAnswers);
      if (!aiQ) {
        // Fallback to static questions
        setCurrentQ(newAnswers.length);
      }
    } else {
      computeResult(newAnswers);
    }
  };

  const computeResult = async (allAnswers) => {
    setSubmitting(true);
    // Tally votes for each stream/course
    const tally = {};
    allAnswers.forEach(ans => {
      const key = grade === '12th' ? ans.course : ans.stream;
      if (key) tally[key] = (tally[key] || 0) + 1;
    });

    const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    const topResult = sorted.length > 0 ? sorted[0][0] : (grade === '12th' ? 'Engineering' : 'Science');

    // Also call the ML service for a more advanced prediction
    let finalResult = {
      primary: topResult,
      mlPrediction: null,
      allScores: sorted
    };

    try {
      const endpoint = grade === '12th' ? '/api/recommend/course' : '/api/recommend/stream';
      const mlBaseUrl = import.meta.env.VITE_ML_BASE_URL || 'http://localhost:8000';
      const mlRes = await axios.post(`${mlBaseUrl}${endpoint}`, {
        answers: allAnswers,
        grade
      });
      finalResult = {
        ...finalResult,
        mlPrediction: grade === '12th' ? mlRes.data.recommended_course : mlRes.data.recommended_stream,
        confidence: mlRes.data.confidence,
      };
    } catch (err) {
      console.warn("ML Service unavailable, using fallback tally");
    }

    // Save to our backend
    if (user) {
      try {
        const res = await axios.post(`${API_BASE_URL}/students/${user.uid}/questionnaire`, {
          grade,
          answers: allAnswers,
          recommended_stream: grade === '10th' ? finalResult.primary : null,
          recommended_courses: grade === '12th' ? [finalResult.primary] : null
        });
        setStudentProfile(res.data.student);
      } catch (error) {
        console.error("Error saving questionnaire results", error);
      }
    }
    
    setResult(finalResult);
    setSubmitting(false);
  };

  const progress = ((currentQ + (result ? 1 : 0)) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-2xl mx-auto"
    >
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-display font-bold">
            {grade === '12th' ? 'Course Finder' : 'Stream Finder'}
          </h2>
          <span className="text-sm text-white/50">After {grade}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-career-primary to-career-secondary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-white/40 mt-1">
          {result ? 'Complete!' : `Question ${currentQ + 1} of ${questions.length}`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 w-full text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-career-primary to-career-secondary flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <h3 className="text-2xl font-display font-bold mb-2">Your Result</h3>
            <p className="text-white/50 text-sm mb-6">Based on your answers and AI analysis</p>

            <div className="bg-gradient-to-r from-career-primary/20 to-career-secondary/20 border border-career-primary/30 rounded-2xl p-6 mb-6">
              <p className="text-sm text-white/60 mb-1">
                {grade === '12th' ? 'Recommended Course' : 'Recommended Stream'}
              </p>
              <h4 className="text-3xl font-display font-bold text-career-primary">
                {result.primary}
              </h4>
              {result.mlPrediction && (
                <p className="text-sm text-career-accent mt-2">
                  ML Engine also suggests: <strong>{result.mlPrediction}</strong>
                  {result.confidence && ` (${Math.round(result.confidence * 100)}% confidence)`}
                </p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-white/50 mb-3">Full Score Breakdown</p>
              <div className="space-y-2">
                {result.allScores.map(([name, count]) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-sm text-white/70 w-32 text-right">{name}</span>
                    <div className="flex-1 bg-white/10 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / 5) * 100}%` }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="bg-career-secondary h-3 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-white/50 w-8">{count}/5</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  const filterType = grade === '12th' ? result.primary : 'FYJC';
                  navigate(`/explore?type=${filterType}`);
                }} 
                className="btn-primary flex-1"
              >
                Explore Colleges
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-outline flex-1">
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        ) : submitting ? (
          <div className="glass-card p-12 w-full flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-career-secondary mb-4"></div>
            <p className="text-white/60">Analyzing your responses with AI...</p>
          </div>
        ) : (
          <motion.div
            key={aiLoading ? 'loading' : (dynamicQuestion ? 'ai-' + answers.length : currentQ)}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 w-full"
          >
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-career-primary mb-4"></div>
                <p className="text-white/60 text-sm italic">AI Counselor is thinking...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-career-primary uppercase font-bold tracking-widest">{dynamicQuestion ? 'Adaptive Insight' : 'Foundation Question'}</span>
                    <h3 className="text-xl font-semibold">
                      {dynamicQuestion ? dynamicQuestion.question : questions[currentQ].question}
                    </h3>
                  </div>
                  {dynamicQuestion && (
                    <span className="bg-career-primary/20 text-career-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter shrink-0">AI Live</span>
                  )}
                </div>

                <div className="space-y-3">
                  {(dynamicQuestion ? dynamicQuestion.options : questions[currentQ].options).map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 bg-black/20 border border-white/10 rounded-xl hover:bg-career-primary/10 hover:border-career-primary/30 transition-all duration-200 group flex items-center"
                    >
                      <span className="text-career-primary/60 font-mono text-sm mr-3 group-hover:text-career-primary">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{typeof option === 'string' ? option : option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Questionnaire;
