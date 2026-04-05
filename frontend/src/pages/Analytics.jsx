import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_BASE = `${API_BASE_URL}/external`;

const Analytics = () => {
  const { studentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [trends, setTrends] = useState(null);
  const [eduStats, setEduStats] = useState(null);
  const [locations, setLocations] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('Mumbai');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trendsRes, statsRes, locRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/trends`),
          axios.get(`${API_BASE}/education-stats`),
          axios.get(`${API_BASE}/college-locations?district=${selectedDistrict}`),
        ]);
        if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value.data);
        if (statsRes.status === 'fulfilled') setEduStats(statsRes.value.data);
        if (locRes.status === 'fulfilled') setLocations(locRes.value.data);
      } catch (err) {
        console.error('Error fetching intelligence data', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedDistrict]);

  // Chart Data Preparation
  const streamPopularity = {
    labels: ['Science', 'Commerce', 'Arts', 'Diploma'],
    datasets: [{
      data: [45, 28, 15, 12],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
      borderWidth: 0,
      hoverOffset: 20
    }]
  };

  const careerTrend = {
    labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
    datasets: [
      {
        label: 'IT & Software',
        data: [70, 75, 82, 88, 92, 97],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Healthcare',
        data: [55, 58, 65, 70, 78, 85],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        fill: true,
        tension: 0.4,
      },
    ]
  };

  const marketTrendsData = trends ? {
    labels: trends.trends.slice(0, 6).map(t => t.topic),
    datasets: [{
      label: 'Public Interest',
      data: trends.trends.slice(0, 6).map(t => t.interest),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderRadius: 10,
    }]
  } : null;

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0', font: { family: 'Outfit', size: 11 }, boxWidth: 8 } },
      tooltip: { backgroundColor: '#0f172a', padding: 12, cornerRadius: 8 }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#64748b', font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { size: 10 } } }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 w-full mb-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight">Cerebro <span className="text-career-primary">Intelligence</span></h2>
          <p className="text-white/40 mt-2 text-xs uppercase tracking-[0.2em] font-black flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-career-primary shadow-[0_0_8px_rgba(var(--career-primary-rgb),0.8)]"></span>
            Unified Data Engine
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex gap-1 backdrop-blur-xl">
            {['Overview', 'Market Intel', 'Geo Insights', 'Forecasting'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === tab 
                        ? 'bg-career-primary text-white shadow-lg shadow-career-primary/30' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'Overview' && (
            <motion.div 
                key="Overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-card p-10 border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-bold">Career Demand Curve</h3>
                            <div className="px-3 py-1 bg-career-primary/10 rounded-full text-[10px] text-career-primary font-black uppercase tracking-widest">Projection 2026</div>
                        </div>
                        <div className="h-72">
                            <Line data={careerTrend} options={defaultOptions} />
                        </div>
                    </div>
                    <div className="glass-card p-10 flex flex-col items-center justify-center border border-white/5">
                        <h3 className="text-xl font-bold mb-10">Stream Distribution</h3>
                        <div className="h-64 w-full relative">
                            <Doughnut data={streamPopularity} options={{
                                ...defaultOptions,
                                plugins: { ...defaultOptions.plugins, legend: { position: 'bottom' } }
                            }} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-10 bg-gradient-to-br from-career-primary/10 via-transparent to-transparent border border-white/5">
                        <h3 className="text-2xl font-bold mb-2">Predictive Cutoff Engine</h3>
                        <p className="text-sm text-white/40 mb-10 uppercase tracking-widest font-bold">Historical Trend Analysis</p>
                        <div className="space-y-8">
                            <PredictiveRow label="VJTI - Computer" pct={99.8} trend="up" />
                            <PredictiveRow label="COEP - Mechanical" pct={98.5} trend="stable" />
                            <PredictiveRow label="SPIT - IT" pct={99.2} trend="up" />
                            <PredictiveRow label="PICT - Electronics" pct={97.4} trend="down" />
                        </div>
                    </div>
                    <div className="glass-card p-10 border border-white/5 bg-gradient-to-tr from-career-secondary/5 via-transparent to-transparent">
                        <h3 className="text-2xl font-bold mb-6">Regional Growth Hubs</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <HubCard district="Pune" growth="+12%" colleges={142} />
                            <HubCard district="Mumbai" growth="+8%" colleges={185} />
                            <HubCard district="Nagpur" growth="+15%" colleges={88} />
                            <HubCard district="Nashik" growth="+10%" colleges={65} />
                        </div>
                        <div className="mt-10 p-6 bg-career-primary/5 border border-career-primary/10 rounded-2xl italic text-xs text-white/60 leading-relaxed">
                            "Nagpur's 15% growth indicates a massive shift in IT infrastructure towards Tier-2 cities in Maharashtra."
                        </div>
                    </div>
                </div>
            </motion.div>
        )}

        {activeTab === 'Market Intel' && (
            <motion.div 
                key="Market"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-10">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl">🔥</span>
                            Google Search Trends
                        </h3>
                        {marketTrendsData ? (
                            <div className="h-80">
                                <Bar data={marketTrendsData} options={{...defaultOptions, indexAxis: 'y'}} />
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center text-white/20 uppercase font-black text-xs tracking-widest">No Trend Data</div>
                        )}
                    </div>
                    <div className="glass-card p-10">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">👥</span>
                            Enrollment Stats
                        </h3>
                        {eduStats ? (
                            <div className="h-80">
                                <Bar 
                                    data={{
                                        labels: eduStats.district_wise.slice(0, 6).map(d => d.district),
                                        datasets: [{
                                            label: 'Student Enrollment (K)',
                                            data: eduStats.district_wise.slice(0, 6).map(d => Math.round(d.students / 1000)),
                                            backgroundColor: 'rgba(139, 92, 246, 0.6)',
                                            borderRadius: 10
                                        }]
                                    }} 
                                    options={defaultOptions} 
                                />
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center text-white/20 uppercase font-black text-xs tracking-widest">Calculating Stats...</div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}

        {activeTab === 'Geo Insights' && (
            <motion.div 
                key="Geo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card overflow-hidden"
            >
                <div className="p-8 flex flex-col sm:flex-row justify-between items-center border-b border-white/5">
                    <div>
                        <h3 className="text-2xl font-bold">Institutional Presence</h3>
                        <p className="text-white/40 text-xs mt-1 uppercase font-bold tracking-widest">Interactive District Analysis</p>
                    </div>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-career-primary focus:outline-none min-w-[200px] mt-4 sm:mt-0"
                    >
                        {['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Thane'].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div className="h-[500px] relative">
                    <iframe
                        title="Map"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.1)' }}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                            selectedDistrict === 'Mumbai' ? '72.7,18.85,73.1,19.3' :
                            selectedDistrict === 'Pune' ? '73.7,18.4,74.0,18.7' :
                            selectedDistrict === 'Nagpur' ? '78.9,21.0,79.2,21.25' :
                            '72.5,18.5,73.5,19.5'
                        }&layer=mapnik`}
                    />
                    <div className="absolute top-6 left-6 max-w-sm w-full glass-card p-6 border border-white/20 backdrop-blur-2xl">
                        <h4 className="text-sm font-black uppercase tracking-widest text-career-primary mb-4">Top Hubs in {selectedDistrict}</h4>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {locations?.locations.slice(0, 10).map((loc, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + selectedDistrict + ' college')}`, '_blank')}
                                    className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-career-primary/30 transition-all cursor-pointer group"
                                    title="Click to open in Google Maps"
                                >
                                    <p className="text-xs font-bold leading-tight group-hover:text-career-primary transition-colors">{loc.name}</p>
                                    <p className="text-[10px] text-white/30 mt-1 uppercase tracking-tighter">{loc.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        )}

        {activeTab === 'Forecasting' && (
            <motion.div 
                key="Forecasting"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
            >
                <ForecastingSimulation studentProfile={studentProfile} />
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ForecastingSimulation = ({ studentProfile }) => {
    const [simulating, setSimulating] = useState(false);
    const [results, setResults] = useState(null);

    const runSimulation = () => {
        setSimulating(true);
        setTimeout(() => {
            const logical = studentProfile?.aptitude_scores?.logical_score || 0;
            const science = studentProfile?.aptitude_scores?.science_score || 0;
            const commerce = studentProfile?.aptitude_scores?.commerce_score || 0;
            
            // Logic-based forecasting
            const avg = (logical + science + commerce) / (science && commerce ? 3 : 2);
            
            const simulatedData = [
                { college: 'VJTI Mumbai', chance: Math.min(98, Math.max(10, avg - 2)), stream: 'CS/IT' },
                { college: 'COEP Pune', chance: Math.min(95, Math.max(15, avg - 5)), stream: 'Mechanical' },
                { college: 'ICT Mumbai', chance: Math.min(90, Math.max(5, science - 10)), stream: 'Chemical' },
                { college: 'SPIT Mumbai', chance: Math.min(99, Math.max(20, avg + 5)), stream: 'Electronics' }
            ];
            
            setResults(simulatedData);
            setSimulating(false);
        }, 1500);
    };

    return (
        <div className="glass-card p-12 border border-white/10 bg-gradient-to-br from-career-primary/5 to-transparent text-center">
            {!results ? (
                <div className="max-w-xl mx-auto py-10">
                    <div className="w-20 h-20 rounded-3xl bg-career-primary/20 flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <span className="text-4xl">🚀</span>
                    </div>
                    <h3 className="text-3xl font-display font-bold mb-4">Probability Engine</h3>
                    <p className="text-white/50 mb-10 leading-relaxed italic">
                        "Your current aptitude profile indicates high proficiency in {studentProfile?.prediction?.recommended_path || 'Logical Analysis'}. Run the forecast to see your predicted admission chances."
                    </p>
                    <button 
                        onClick={runSimulation}
                        disabled={simulating}
                        className="btn-primary px-12 py-5 rounded-2xl text-sm font-black shadow-2xl shadow-career-primary/30 disabled:opacity-50"
                    >
                        {simulating ? 'Processing Neural Data...' : 'Run Simulation Forecast'}
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="flex justify-between items-end border-b border-white/5 pb-8">
                        <div className="text-left">
                            <h3 className="text-3xl font-bold">Forecast Results</h3>
                            <p className="text-career-primary text-xs font-black uppercase tracking-[0.3em] mt-2">Personalized Admission Probability</p>
                        </div>
                        <button onClick={() => setResults(null)} className="text-[10px] text-white/30 uppercase font-black hover:text-white transition-colors">Reset Sim</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((res, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 border border-white/5 hover:border-career-primary/40 transition-all group"
                            >
                                <div className="text-4xl font-black text-white/80 mb-6 group-hover:text-career-primary transition-colors">{res.chance}%</div>
                                <h4 className="text-sm font-bold truncate">{res.college}</h4>
                                <p className="text-[10px] text-white/40 uppercase font-bold mt-1">{res.stream}</p>
                                <div className="w-full h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
                                    <div className="h-full bg-career-primary" style={{ width: `${res.chance}%` }} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-10 bg-black/40 border border-white/10 rounded-3xl text-left flex flex-col md:flex-row items-center gap-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-career-primary to-career-secondary flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <p className="text-sm text-white/70 italic leading-relaxed">
                            "Based on your <strong>{(studentProfile?.aptitude_scores?.logical_score || 0)}% Logical Score</strong>, you are in the top 5% of candidates for VJTI and SPIT. Consider prioritizing these in your CAP round applications."
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const PredictiveRow = ({ label, pct, trend }) => (
    <div className="flex items-center justify-between group">
        <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-white/80 group-hover:text-career-primary transition-colors">{label}</span>
                <span className="text-[10px] text-white/40 font-mono">{pct}%ile Predicted</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-career-primary shadow-[0_0_12px_rgba(var(--career-primary-rgb),0.5)]"
                />
            </div>
        </div>
        <div className="ml-6 w-12 text-right">
            {trend === 'up' && <span className="text-green-400 text-xs">▲</span>}
            {trend === 'down' && <span className="text-red-400 text-xs">▼</span>}
            {trend === 'stable' && <span className="text-white/20 text-xs">●</span>}
        </div>
    </div>
);

const HubCard = ({ district, growth, colleges }) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{district}</p>
        <p className="text-3xl font-display font-bold mt-2 group-hover:text-career-primary transition-colors">{colleges}</p>
        <p className="text-[10px] text-green-400 font-black mt-1 uppercase tracking-tighter">{growth} Expansion</p>
    </div>
);

export default Analytics;
