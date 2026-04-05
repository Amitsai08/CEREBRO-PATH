import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, ingester
  
  // Analytics State
  const [stats, setStats] = useState({
      totalStudents: 0,
      totalColleges: 0,
      streamDistribution: [],
      districtDistribution: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Ingester State
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [extractedColleges, setExtractedColleges] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
      if (activeTab === 'analytics') {
          fetchAnalytics();
      }
  }, [activeTab]);

  const fetchAnalytics = async () => {
      try {
          setLoadingStats(true);
          const res = await axios.get(`${API_BASE_URL}/admin/analytics`);
          setStats(res.data);
      } catch (error) {
          console.error("Error fetching analytics", error);
      } finally {
          setLoadingStats(false);
      }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('idle');
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('pdf', file);

    try {
        setStatus('extracting');
        const res = await axios.post(`${API_BASE_URL}/admin/upload-pdf`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.colleges) {
            setExtractedColleges(res.data.colleges);
            setStatus('complete');
            setMessage(`Extracted ${res.data.colleges.length} colleges successfully!`);
        } else if (res.data.rawText) {
            setMessage("Groq API key not found. Showing extracted text:");
            setMessage(prev => prev + "\n" + res.data.rawText);
            setStatus('idle');
        }
    } catch (error) {
        setStatus('idle');
        setMessage("Error processing PDF. Ensure your GROQ_API_KEY is active.");
    }
  };

  const handleSaveAll = async () => {
    setStatus('saving');
    try {
        const res = await axios.post(`${API_BASE_URL}/admin/bulk-save`, { colleges: extractedColleges });
        setMessage(`Saved successfully! ${res.data.inserted} added, ${res.data.updated} updated.`);
        setExtractedColleges([]);
        setStatus('complete');
        fetchAnalytics(); // Refresh stats
    } catch (error) {
        setStatus('complete');
        setMessage("Error saving to database.");
    }
  };

  // Chart Graphics Configurations
  const streamChartData = {
      labels: stats.streamDistribution.map(s => s.stream),
      datasets: [{
          data: stats.streamDistribution.map(s => s.count),
          backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'],
          borderWidth: 0,
          hoverOffset: 10
      }]
  };

  const districtChartData = {
      labels: stats.districtDistribution.map(d => d.district),
      datasets: [{
          label: 'Institutions',
          data: stats.districtDistribution.map(d => d.count),
          backgroundColor: '#3b82f6',
          borderRadius: 4
      }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: 'rgba(255,255,255,0.7)', font: { size: 10 } } }
    }
  };

  const barOptions = {
      responsive: true, maintainAspectRatio: false,
      scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
          x: { grid: { display: false }, ticks: { color: '#e2e8f0' } }
      },
      plugins: { legend: { display: false } }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-4xl font-display font-bold mb-2">Cerebro Command Center</h1>
                <p className="text-white/50">Real-time system analytics and data ingestion pipeline.</p>
            </div>
            
            {/* Tab Toggles */}
            <div className="flex bg-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-career-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >Analytics</button>
                <button 
                  onClick={() => setActiveTab('ingester')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ingester' ? 'bg-career-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >Data Ingestion</button>
            </div>
        </div>

        <AnimatePresence mode="wait">
        {activeTab === 'analytics' ? (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                
                {/* KPI Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard title="Total Students" value={stats.totalStudents} icon="👨‍🎓" color="from-blue-500 to-cyan-500" />
                    <KPICard title="Total Institutions" value={stats.totalColleges} icon="🏫" color="from-purple-500 to-pink-500" />
                    <KPICard title="AI Stream Profiles" value={stats.streamDistribution.length} icon="🧠" color="from-amber-400 to-orange-500" />
                    <KPICard title="Districts Covered" value={stats.districtDistribution.length} icon="📍" color="from-emerald-400 to-teal-500" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stream Distribution Chart */}
                    <div className="glass-card p-6 lg:p-8 col-span-1 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full" />
                        <h3 className="text-xl font-bold mb-6">AI Predicted Trajectories</h3>
                        {loadingStats ? (
                            <div className="h-64 flex items-center justify-center"><div className="animate-pulse text-white/30 text-xs tracking-widest uppercase">Syncing Data...</div></div>
                        ) : stats.streamDistribution.length > 0 ? (
                            <div className="h-64">
                                <Doughnut data={streamChartData} options={chartOptions} />
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-white/20">No predictions yet</div>
                        )}
                    </div>

                    {/* District Bar Chart */}
                    <div className="glass-card p-6 lg:p-8 col-span-1 lg:col-span-2 border border-white/5 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
                        <h3 className="text-xl font-bold mb-6">Institution Geographic Spread</h3>
                        {loadingStats ? (
                            <div className="h-64 flex items-center justify-center"><div className="animate-pulse text-white/30 text-xs tracking-widest uppercase">Syncing Data...</div></div>
                        ) : stats.districtDistribution.length > 0 ? (
                            <div className="h-64">
                                <Bar data={districtChartData} options={barOptions} />
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-white/20">No institutions loaded</div>
                        )}
                    </div>
                </div>

            </motion.div>
        ) : (
            <motion.div key="ingester" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Data Ingestion UI */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Box */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-8 border-dashed border-2 border-career-primary/20 hover:border-career-primary/50 transition-colors flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-career-primary/10 rounded-full flex items-center justify-center mb-4 text-career-primary shadow-[0_0_15px_rgba(var(--career-primary-rgb),0.3)]">
                                🤖
                            </div>
                            <h3 className="text-lg font-bold mb-2">Groq Extractor Model</h3>
                            <p className="text-sm text-white/40 mb-6 px-4">Upload official Maharashtra CET/DTE PDF tables. AI will perfectly structure them.</p>
                            
                            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                            <label htmlFor="pdf-upload" className="btn-outline cursor-pointer mb-4 w-full">{file ? file.name : 'Select PDF File'}</label>
                            <button onClick={handleUpload} disabled={!file || status !== 'idle'} className={`btn-primary w-full ${(!file || status !== 'idle') ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {status === 'idle' ? 'Extract via Groq API' : 'Processing Model...'}
                            </button>
                        </div>

                        {message && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl text-sm font-medium border ${message.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                                <div className="whitespace-pre-wrap">{message}</div>
                            </motion.div>
                        )}
                    </div>

                    {/* Preview Table */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-6 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Extraction Buffer</h3>
                                {extractedColleges.length > 0 && (
                                    <button onClick={handleSaveAll} disabled={status === 'saving'} className="px-6 py-2 bg-gradient-to-r from-career-primary to-blue-500 font-bold text-white rounded-lg shadow-lg hover:scale-105 transition-all text-xs uppercase tracking-widest">
                                        {status === 'saving' ? 'Committing...' : 'Commit to Database'}
                                    </button>
                                )}
                            </div>
                            
                            {extractedColleges.length > 0 ? (
                                <div className="overflow-auto max-h-[500px]">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-career-dark text-white/50 uppercase text-[10px] tracking-widest sticky top-0">
                                            <tr>
                                                <th className="p-4 border-b border-white/5">Institution</th>
                                                <th className="p-4 border-b border-white/5">Code</th>
                                                <th className="p-4 border-b border-white/5">District</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {extractedColleges.map((col, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-medium">{col.college_name}</td>
                                                    <td className="p-4 font-mono text-career-primary">{col.institute_code}</td>
                                                    <td className="p-4">{col.district}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl bg-black/20 pb-12">
                                    <div className="text-6xl mb-4 opacity-50">📥</div>
                                    <p>Awaiting PDF payload injection.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

const KPICard = ({ title, value, icon, color }) => (
    <div className="glass-card p-6 border border-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 blur-[40px] group-hover:opacity-20 transition-opacity`} />
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-white/50 uppercase font-black tracking-widest">{title}</h3>
            <span className="text-xl bg-white/5 p-2 rounded-xl">{icon}</span>
        </div>
        <h2 className="text-4xl font-display font-bold">{value || 0}</h2>
    </div>
);

export default DataManagement;
