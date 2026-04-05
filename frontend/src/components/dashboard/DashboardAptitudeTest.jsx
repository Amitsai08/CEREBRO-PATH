import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { aptitudeQuestions } from '../../data/questions';

const DashboardAptitudeTest = ({ onComplete }) => {
    const { studentProfile, setStudentProfile } = useAuth();
    const [step, setStep] = useState('intro'); // intro, logical, field, results
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [saving, setSaving] = useState(false);

    const field = studentProfile?.academic_info?.class_level === '10th' ? 'science' : 'commerce'; // Mock logic for field selection
    const logicalQs = aptitudeQuestions.logical;
    const fieldQs = aptitudeQuestions[field] || aptitudeQuestions.science;

    const currentQuestions = step === 'logical' ? logicalQs : fieldQs;

    const handleAnswer = (answer) => {
        const qId = currentQuestions[currentQuestionIndex].id;
        setAnswers({ ...answers, [qId]: answer });

        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            if (step === 'logical') {
                setStep('field');
                setCurrentQuestionIndex(0);
            } else {
                calculateAndSaveResults();
            }
        }
    };

    const calculateAndSaveResults = async () => {
        setSaving(true);
        
        let logicalScore = 0;
        let fieldScore = 0;

        logicalQs.forEach(q => {
            if (answers[q.id] === q.answer) logicalScore += 10;
        });

        fieldQs.forEach(q => {
            if (answers[q.id] === q.answer) fieldScore += 3.33; // 30 questions * 3.33 =~ 100
        });

        try {
            const payload = {
                logical_score: Math.round(logicalScore),
                [field === 'science' ? 'science_score' : 'commerce_score']: Math.round(fieldScore),
                uid: studentProfile.uid
            };

            const res = await axios.put(`http://localhost:5000/api/students/${studentProfile.uid}/aptitude`, payload);
            setStudentProfile({ ...studentProfile, aptitude_scores: res.data.aptitude_scores, prediction: res.data.prediction });
            setStep('results');
        } catch (error) {
            console.error("Error saving test results", error);
        } finally {
            setSaving(false);
        }
    };

    if (step === 'intro') {
        return (
            <div className="glass-card p-10 text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-career-primary/20 flex items-center justify-center text-4xl mb-2">🧠</div>
                <h3 className="text-3xl font-display font-bold">Ready for your Assessment?</h3>
                <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    We've integrated the aptitude test directly into your dashboard. Complete 10 logical games and 30 field questions to get your AI-powered career prediction.
                </p>
                <button 
                    onClick={() => setStep('logical')}
                    className="btn-primary px-12 py-4 text-lg mt-4 shadow-xl shadow-career-primary/20"
                >
                    Start Assessment
                </button>
            </div>
        );
    }

    if (step === 'results') {
        return (
            <div className="glass-card p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-5xl mx-auto mb-6">✅</div>
                <h3 className="text-4xl font-display font-bold mb-4">Assessment Complete!</h3>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                    Your scores have been updated and our AI is analyzing your profile. Check your new career recommendations below.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">Logical</p>
                        <p className="text-2xl font-bold text-career-primary">{studentProfile?.aptitude_scores?.logical_score}%</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">{field.toUpperCase()}</p>
                        <p className="text-2xl font-bold text-career-secondary">{studentProfile?.aptitude_scores?.[field === 'science' ? 'science_score' : 'commerce_score']}%</p>
                    </div>
                </div>
                <button 
                    onClick={onComplete}
                    className="btn-outline px-10 py-3 rounded-full"
                >
                    Back to Dashboard Overview
                </button>
            </div>
        );
    }

    const currentQ = currentQuestions[currentQuestionIndex];

    return (
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            {saving && (
                <div className="absolute inset-0 bg-career-dark/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-career-primary shadow-[0_0_15px_rgba(var(--career-primary-rgb),0.5)]"></div>
                    <p className="text-xl font-display text-white animate-pulse">Cerebro AI is processing your results...</p>
                </div>
            )}

            <div className="flex justify-between items-center mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-career-primary mb-2 block">
                      Part {step === 'logical' ? 'I' : 'II'}: {step === 'logical' ? 'Logical Reasoning' : `${field.toUpperCase()} Proficiency`}
                  </span>
                  <p className="text-sm text-white/40">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
                </div>
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                        className="h-full bg-career-primary"
                    />
                </div>
            </div>

            <motion.div 
                key={currentQ.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mb-12"
            >
                <h4 className="text-2xl md:text-3xl font-display font-medium leading-snug mb-8">
                    {currentQ.question}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQ.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(option)}
                            className="p-6 text-left rounded-2xl bg-white/5 border border-white/10 hover:bg-career-primary/10 hover:border-career-primary/40 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold group-hover:bg-career-primary group-hover:text-white transition-colors">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-lg text-white/80 group-hover:text-white transition-colors">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardAptitudeTest;
