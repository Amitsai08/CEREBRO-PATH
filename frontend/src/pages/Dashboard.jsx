import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';
import DashboardAptitudeTest from '../components/dashboard/DashboardAptitudeTest';
import AIChatModal from '../components/dashboard/AIChatModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { studentProfile } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTest, setShowTest] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const recommendedPath = studentProfile?.prediction?.recommended_path;
            const res = await axios.get(`${API_BASE_URL}/colleges`, {
                params: { 
                    course: recommendedPath?.split(' / ')[0] || '',
                    limit: 6
                }
            });
            setColleges(res.data.colleges || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching colleges", error);
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, [studentProfile]);

  // Mock Analytics Data for Module 7
  const chartData = {
    labels: ['IT', 'Commerce', 'Science', 'Arts', 'Diploma'],
    datasets: [
      {
        label: 'Market Opportunity Index',
        data: [95, 82, 88, 65, 75],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 8,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
        y: { 
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, 
            ticks: { color: '#64748b', font: { size: 10 } } 
        },
        x: { 
            grid: { display: false }, 
            ticks: { color: '#e2e8f0', font: { size: 10, weight: 'bold' } } 
        }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-8 w-full"
    >
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-display font-bold">Welcome, <span className="bg-gradient-to-r from-career-primary to-white bg-clip-text text-transparent">{studentProfile?.name || 'Student'}</span></h2>
          <div className="flex gap-4">
            {showTest && (
                <button 
                    onClick={() => setShowTest(false)}
                    className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                >
                    <span>← Dashboard</span>
                </button>
            )}
            <button 
                onClick={() => setIsChatOpen(true)}
                className="btn-outline px-6 py-2 rounded-xl text-xs flex items-center gap-2"
            >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                AI Support
            </button>
          </div>
      </div>

      <AnimatePresence mode="wait">
      {showTest ? (
          <motion.div 
            key="test"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
              <DashboardAptitudeTest onComplete={() => setShowTest(false)} />
          </motion.div>
      ) : (
          <motion.div 
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            {loading ? (
                <div className="flex flex-col justify-center items-center h-96 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-career-primary"></div>
                    <p className="text-white/40 text-xs animate-pulse">Tailoring recommendations...</p>
                </div>
            ) : (
                <>
                  {/* Performance Matrix */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="glass-card p-8 lg:col-span-2 border border-white/5 space-y-8">
                          <div className="flex justify-between items-center">
                              <h3 className="text-xl font-bold">Competitive Landscape</h3>
                              <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Projection 2026</span>
                          </div>
                          <div className="h-64">
                              <Bar options={chartOptions} data={chartData} />
                          </div>
                      </div>

                      <div className="glass-card p-10 flex flex-col gap-10 bg-gradient-to-br from-career-primary/10 via-transparent to-transparent border border-career-primary/20 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-career-primary/10 blur-[60px] rounded-full" />
                          
                          {/* Recommended Path Banner */}
                          {studentProfile?.prediction?.recommended_path && studentProfile.prediction.recommended_path !== 'Undecided' && (
                              <div className="p-4 bg-gradient-to-r from-career-primary/20 to-transparent border-l-4 border-career-primary rounded-r-xl">
                                  <p className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em] mb-1">🎯 RECOMMENDED DESTINATION</p>
                                  <h3 className="text-2xl font-display font-bold text-white shadow-sm shadow-career-primary/30">
                                      {studentProfile.prediction.recommended_path}
                                  </h3>
                              </div>
                          )}

                          <h3 className="text-xl font-bold">Assessment Metrics</h3>
                          <div className="space-y-8">
                              <ScoreProgress label="Logic Index" score={studentProfile?.aptitude_scores?.logical_score} color="bg-career-primary" />
                              <ScoreProgress 
                                label={studentProfile?.academic_info?.class_level === '10th' ? 'Science / STEM' : 'Commerce / Mgmt'} 
                                score={studentProfile?.aptitude_scores?.science_score || studentProfile?.aptitude_scores?.commerce_score} 
                                color="bg-career-secondary" 
                              />
                              <button 
                                onClick={() => setShowTest(true)} 
                                className="btn-primary w-full py-5 rounded-2xl text-sm font-black shadow-2xl shadow-career-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              >
                                  {studentProfile?.aptitude_scores?.logical_score ? 'Retake Analysis' : 'Initialize Analysis'}
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* AI Counselor Insight Card */}
                  <AICounselorCard profile={studentProfile} onChatClick={() => setIsChatOpen(true)} />

                  {/* Recommendations */}
                  <div>
                      <div className="flex justify-between items-center mb-10">
                          <div>
                            <h3 className="text-3xl font-display font-bold uppercase tracking-widest">CURATED PATH</h3>
                            <p className="text-white/40 text-sm mt-1">Institutions aligned with your cognitive forecasting</p>
                          </div>
                          <Link to="/explore" className="text-xs font-black text-career-primary uppercase tracking-[0.2em] border-b border-career-primary/50 pb-1 hover:text-white hover:border-white transition-all">Explore Map</Link>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {colleges.length > 0 ? colleges.map((college, i) => (
                              <CollegeCard i={i} key={college._id} college={college} />
                          )) : (
                              <div className="col-span-full text-center p-20 glass-card border-dashed">
                                  <p className="text-white/30 text-lg font-display">Complete assessment to unlock recommendations</p>
                              </div>
                          )}
                      </div>
                  </div>
                </>
            )}
          </motion.div>
      )}
      </AnimatePresence>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.div>
  );
};

const ScoreProgress = ({ label, score, color }) => (
    <div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
            <span className="text-white/40">{label}</span>
            <span className={`${color.replace('bg-', 'text-')} opacity-100`}>
                {score ? `${score}%` : 'Pending'}
            </span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score || 0}%` }}
                className={`${color} h-1.5 rounded-full shadow-[0_0_8px_rgba(var(--career-primary-rgb),0.3)]`}
            ></motion.div>
        </div>
    </div>
);

const CollegeCard = ({ college, i }) => (
    <Link to={`/explore?college=${college._id}`}>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card h-full group overflow-hidden border border-white/5 hover:border-career-primary/30 transition-all duration-300"
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-1 bg-white/5 rounded border border-white/5 text-white/40">{college.type}</span>
                    <span className="text-[10px] font-bold text-career-primary uppercase tracking-widest">{college.district}</span>
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-career-primary transition-colors line-clamp-2 min-h-[3.5rem]">{college.college_name}</h4>
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs text-white/30 font-mono">CODE: {college.institute_code}</span>
                </div>
                
                <div className="space-y-3">
                    {college.courses.slice(0,2).map(course => (
                        <div key={course._id} className="group/course flex flex-col p-3 rounded-xl bg-black/40 border border-white/5 hover:bg-career-primary/5 hover:border-career-primary/20 transition-all">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-medium text-white/60 truncate mr-2">{course.course_name}</span>
                                <span className="text-xs font-bold text-career-primary">{course.previous_cutoff}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    </Link>
);

const AICounselorCard = ({ profile, onChatClick }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.prediction?.insights) {
            setInsight(profile.prediction.insights);
            setLoading(false);
            return;
        }

        const fetchInsight = async () => {
            try {
                const res = await axios.post(`${API_BASE_URL}/ai/insight`, {
                    studentProfile: profile,
                    quizResults: profile?.aptitude_scores
                });
                setInsight(res.data.insight);
            } catch (error) {
                setInsight("Keep honing your skills to achieve greatness in your chosen field!");
            } finally {
                setLoading(false);
            }
        };
        fetchInsight();
    }, [profile]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full relative overflow-hidden rounded-[2.5rem] p-10 mb-8 border border-white/10 group bg-cover bg-center shadow-2xl"
            style={{ 
                backgroundImage: `linear-gradient(to right, rgba(13, 14, 18, 0.95), rgba(13, 14, 18, 0.7)), url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200')` 
            }}
        >
            <div className="absolute inset-0 bg-career-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-shrink-0 relative">
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-career-primary to-career-secondary flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                    <h4 className="text-sm font-bold text-career-primary uppercase tracking-[0.3em] mb-4">Cerebro AI Intelligence</h4>
                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-white/5 rounded-full animate-pulse"></div>
                            <div className="h-4 w-2/3 bg-white/5 rounded-full animate-pulse"></div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-2xl font-display font-medium text-white leading-relaxed italic mb-4">
                                "{insight?.length > 150 ? insight.substring(0, 147) + "..." : insight}"
                            </p>
                            {profile?.prediction?.recommended_path && (
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-career-primary/20 rounded-xl border border-career-primary/30">
                                    <span className="text-[10px] font-bold text-career-primary uppercase tracking-widest">Recommended Path</span>
                                    <span className="text-sm font-bold text-white">{profile.prediction.recommended_path}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onChatClick}
                        className="px-8 py-3 bg-white/5 hover:bg-career-primary text-white rounded-2xl text-sm font-bold border border-white/10 hover:border-career-primary transition-all duration-300 shadow-xl"
                    >
                        AI Chat
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
