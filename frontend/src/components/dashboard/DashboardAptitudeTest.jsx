import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getTestPlan } from '../../data/questions';
import API_BASE_URL from '../../api/config';

const DashboardAptitudeTest = ({ onComplete }) => {
    const { studentProfile, setStudentProfile } = useAuth();
    const classLevel = studentProfile?.academic_info?.class_level || '10th';
    const testPlan = getTestPlan(classLevel);

    const [step, setStep] = useState('intro'); // intro, testing, results
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [phaseScores, setPhaseScores] = useState({});
    const [saving, setSaving] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const currentPhase = testPlan.phases[currentPhaseIndex];
    const currentQuestions = currentPhase?.questions || [];
    const currentQ = currentQuestions[currentQuestionIndex];

    // Calculate overall progress
    let questionsCompletedBefore = 0;
    for (let i = 0; i < currentPhaseIndex; i++) {
        questionsCompletedBefore += testPlan.phases[i].questions.length;
    }
    const totalProgress = ((questionsCompletedBefore + currentQuestionIndex) / testPlan.totalQuestions) * 100;

    const handleAnswer = (answer) => {
        setSelectedOption(answer);
        const qId = currentQ.id;
        const isCorrect = answer === currentQ.answer;
        
        setAnswers(prev => ({ ...prev, [qId]: { answer, isCorrect } }));

        setTimeout(() => {
            setSelectedOption(null);
            
            if (currentQuestionIndex < currentQuestions.length - 1) {
                // Next question in phase
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // Phase complete — compute score for this phase
                const phaseKey = currentPhase.key;
                let correct = 0;
                currentQuestions.forEach(q => {
                    // Check previously stored answer + the current one
                    const stored = answers[q.id];
                    if (stored?.isCorrect) correct++;
                    if (q.id === qId && isCorrect) correct++;
                });
                // Adjust for double-count on current question
                const totalPhaseScore = Math.round((correct / currentQuestions.length) * 100);
                
                setPhaseScores(prev => ({ ...prev, [phaseKey]: totalPhaseScore }));

                if (currentPhaseIndex < testPlan.phases.length - 1) {
                    // Move to next phase
                    setCurrentPhaseIndex(currentPhaseIndex + 1);
                    setCurrentQuestionIndex(0);
                } else {
                    // All phases complete
                    calculateAndSaveResults();
                }
            }
        }, 600);
    };

    const calculateAndSaveResults = async () => {
        setSaving(true);

        // Calculate per-stream scores from answers
        const streamScores = {};
        testPlan.phases.forEach(phase => {
            let correct = 0;
            phase.questions.forEach(q => {
                if (answers[q.id]?.isCorrect) correct++;
            });
            streamScores[phase.key] = Math.round((correct / phase.questions.length) * 100);
        });

        try {
            const payload = {
                logical_score: streamScores.logical || 0,
                science_score: streamScores.science || streamScores.engineering || 0,
                commerce_score: streamScores.commerce || 0,
                creativity_score: streamScores.arts || streamScores.diploma || 0,
                uid: studentProfile.uid
            };

            const res = await axios.put(`${API_BASE_URL}/students/${studentProfile.uid}/aptitude`, payload);
            setStudentProfile({ ...studentProfile, aptitude_scores: res.data.aptitude_scores, prediction: res.data.prediction });
            
            // Use the final computed phase scores for the results page
            setPhaseScores(streamScores);
            setStep('results');
        } catch (error) {
            console.error("Error saving test results", error);
        } finally {
            setSaving(false);
        }
    };

    // ─────── INTRO SCREEN ───────
    if (step === 'intro') {
        return (
            <div className="glass-card p-10 text-center flex flex-col items-center gap-6">
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-career-primary/30 to-purple-500/20 flex items-center justify-center text-5xl mb-2 shadow-[0_0_30px_rgba(var(--career-primary-rgb),0.3)]"
                >🧠</motion.div>
                
                <h3 className="text-3xl font-display font-bold">Cerebro Multi-Stream Assessment</h3>
                <p className="text-white/50 max-w-lg mx-auto leading-relaxed">
                    {testPlan.description}
                </p>

                {/* Phase Preview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full max-w-3xl mt-4">
                    {testPlan.phases.map((phase, i) => (
                        <motion.div 
                            key={phase.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-white/5 border border-white/10 rounded-xl text-center hover:border-career-primary/30 transition-colors"
                        >
                            <div className="text-2xl mb-2">{phase.icon}</div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{phase.label.replace(/[^\w\s]/gi, '').trim()}</p>
                            <p className="text-xs text-career-primary font-bold mt-1">{phase.questions.length} Qs</p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex items-center gap-3 mt-4 text-white/30 text-xs">
                    <span>{testPlan.totalQuestions} Total Questions</span>
                    <span>•</span>
                    <span>{testPlan.phases.length} Phases</span>
                    <span>•</span>
                    <span>~{Math.round(testPlan.totalQuestions * 0.5)} min</span>
                </div>

                <button 
                    onClick={() => setStep('testing')}
                    className="btn-primary px-14 py-4 text-lg mt-4 shadow-xl shadow-career-primary/20 hover:scale-105 active:scale-95 transition-transform"
                >
                    Launch Assessment →
                </button>
            </div>
        );
    }

    // ─────── RESULTS SCREEN ───────
    if (step === 'results') {
        // Sort phase scores for ranking
        const rankings = Object.entries(phaseScores)
            .filter(([key]) => key !== 'logical')
            .sort((a, b) => b[1] - a[1]);

        const medalEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 text-center"
            >
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-5xl mx-auto mb-6">🏆</div>
                <h3 className="text-4xl font-display font-bold mb-2">Assessment Complete!</h3>
                <p className="text-white/50 mb-8 max-w-lg mx-auto">Your cognitive profile has been analyzed across all streams.</p>

                {/* AI Prediction Badge */}
                {studentProfile?.prediction?.recommended_path && studentProfile.prediction.recommended_path !== 'Undecided' && (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10 inline-block p-[2px] rounded-2xl bg-gradient-to-r from-career-primary via-blue-500 to-career-secondary shadow-[0_0_30px_rgba(var(--career-primary-rgb),0.4)]"
                    >
                        <div className="bg-career-dark px-12 py-6 rounded-[14px]">
                            <p className="text-xs text-white/50 uppercase font-black tracking-widest mb-2">🎯 AI Recommended Path</p>
                            <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                {studentProfile.prediction.recommended_path}
                            </h2>
                        </div>
                    </motion.div>
                )}

                {/* Stream Rankings */}
                <div className="max-w-md mx-auto space-y-3 mb-10">
                    <h4 className="text-xs text-white/40 uppercase font-bold tracking-widest mb-4">Your Stream Rankings</h4>
                    {rankings.map(([key, score], idx) => (
                        <motion.div 
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${idx === 0 ? 'bg-career-primary/10 border-career-primary/30' : 'bg-white/5 border-white/10'}`}
                        >
                            <span className="text-2xl">{medalEmojis[idx]}</span>
                            <div className="flex-1 text-left">
                                <p className="font-bold capitalize">{key}</p>
                                <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${score}%` }}
                                        transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                                        className={`h-1.5 rounded-full ${idx === 0 ? 'bg-career-primary' : 'bg-white/30'}`}
                                    />
                                </div>
                            </div>
                            <span className={`text-lg font-bold ${idx === 0 ? 'text-career-primary' : 'text-white/50'}`}>{score}%</span>
                        </motion.div>
                    ))}
                </div>

                {/* Logical Score */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40 uppercase font-bold tracking-widest">🧠 Logical Reasoning</span>
                        <span className="text-lg font-bold text-career-primary">{phaseScores.logical || 0}%</span>
                    </div>
                </div>

                <button onClick={onComplete} className="btn-outline px-10 py-3 rounded-full hover:scale-105 transition-transform">
                    Back to Dashboard
                </button>
            </motion.div>
        );
    }

    // ─────── MAIN TEST SCREEN ───────
    return (
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            {saving && (
                <div className="absolute inset-0 bg-career-dark/90 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-career-primary shadow-[0_0_15px_rgba(var(--career-primary-rgb),0.5)]"></div>
                    <p className="text-xl font-display text-white animate-pulse">Cerebro AI is analyzing your profile...</p>
                </div>
            )}

            {/* Phase & Progress Header */}
            <div className="mb-10">
                {/* Phase indicator pills */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {testPlan.phases.map((phase, i) => (
                        <div 
                            key={phase.key}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                                i < currentPhaseIndex 
                                    ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                                    : i === currentPhaseIndex 
                                        ? 'bg-career-primary/20 border-career-primary/40 text-career-primary' 
                                        : 'bg-white/5 border-white/10 text-white/30'
                            }`}
                        >
                            {i < currentPhaseIndex ? '✓ ' : ''}{phase.label.replace(/[^\w\s/]/gi, '').trim()}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-career-primary mb-1 block">
                            {currentPhase.icon} {currentPhase.label.replace(/[^\w\s/]/gi, '').trim()}
                        </span>
                        <p className="text-sm text-white/40">Q {currentQuestionIndex + 1} / {currentQuestions.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Overall Progress</p>
                        <p className="text-sm font-bold text-career-primary">{Math.round(totalProgress)}%</p>
                    </div>
                </div>

                {/* Global progress bar */}
                <div className="w-full bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${totalProgress}%` }}
                        className="h-full bg-gradient-to-r from-career-primary to-blue-500 rounded-full"
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentQ?.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="mb-8"
                >
                    {/* Difficulty Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${
                            currentQ?.difficulty === 'hard' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                            currentQ?.difficulty === 'medium' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                            'text-green-400 border-green-500/30 bg-green-500/10'
                        }`}>
                            {currentQ?.difficulty}
                        </span>
                    </div>

                    <h4 className="text-2xl md:text-3xl font-display font-medium leading-snug mb-10">
                        {currentQ?.question}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQ?.options.map((option, i) => {
                            const isSelected = selectedOption === option;
                            const isCorrect = isSelected && option === currentQ.answer;
                            const isWrong = isSelected && option !== currentQ.answer;

                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => !selectedOption && handleAnswer(option)}
                                    disabled={!!selectedOption}
                                    className={`p-5 text-left rounded-2xl border transition-all duration-300 group ${
                                        isCorrect ? 'bg-green-500/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                                        isWrong ? 'bg-red-500/20 border-red-500/50' :
                                        selectedOption ? 'bg-white/5 border-white/5 opacity-50' :
                                        'bg-white/5 border-white/10 hover:bg-career-primary/10 hover:border-career-primary/40'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                                            isCorrect ? 'bg-green-500 text-white' :
                                            isWrong ? 'bg-red-500 text-white' :
                                            'bg-white/5 group-hover:bg-career-primary group-hover:text-white'
                                        }`}>
                                            {isCorrect ? '✓' : isWrong ? '✗' : String.fromCharCode(65 + i)}
                                        </span>
                                        <span className={`text-base ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'} transition-colors`}>
                                            {option}
                                        </span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default DashboardAptitudeTest;
