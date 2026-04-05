import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const CollegeExplorer = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Initialize filters from URL if present
  const queryParams = new URLSearchParams(window.location.search);
  
  // Filter States
  const [district, setDistrict] = useState('');
  const [type, setType] = useState(queryParams.get('type') || '');
  const [course, setCourse] = useState('');

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setColleges([]);
  }, [district, type, course]);

  // Fetch Logic
  useEffect(() => {
    const fetchColleges = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (district) params.append('district', district);
            if (type) params.append('type', type);
            if (course) params.append('course', course);
            params.append('page', page);
            params.append('limit', 12);

            const res = await axios.get(`${API_BASE_URL}/colleges?${params.toString()}`);
            
            if (page === 1) {
                setColleges(res.data.colleges);
            } else {
                setColleges(prev => [...prev, ...res.data.colleges]);
            }
            
            setTotalCount(res.data.totalColleges);
            setHasMore(res.data.currentPage < res.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching colleges", error);
            setLoading(false);
        }
    };
    
    const timeoutId = setTimeout(() => fetchColleges(), 300);
    return () => clearTimeout(timeoutId);
  }, [district, type, course, page]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full min-h-[80vh]">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 glass-card p-6 h-fit sticky top-24">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-career-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Explore Filters
            </h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Institution Type</label>
                    <select 
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-career-primary focus:outline-none transition-all"
                        value={type} onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="Engineering">Engineering (CET)</option>
                        <option value="Medical">Medical & Dental (NEET)</option>
                        <option value="Pharmacy">Pharmacy (MHT-CET)</option>
                        <option value="Arts">Arts / Commerce / Law</option>
                        <option value="Diploma">Diploma (DTE)</option>
                        <option value="FYJC">11th Admission (FYJC)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">District</label>
                    <select 
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-career-primary focus:outline-none transition-all"
                        value={district} onChange={(e) => setDistrict(e.target.value)}
                    >
                        <option value="">All Maharashtra</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Nagpur">Nagpur</option>
                        <option value="Nashik">Nashik</option>
                        <option value="Aurangabad">Aurangabad</option>
                        <option value="Thane">Thane</option>
                        <option value="Kolhapur">Kolhapur</option>
                        <option value="Solapur">Solapur</option>
                        <option value="Nanded">Nanded</option>
                        <option value="Amravati">Amravati</option>
                        <option value="Sangli">Sangli</option>
                        <option value="Satara">Satara</option>
                        <option value="Dhule">Dhule</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Preferred Course</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Computer Engineering"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white placeholder-white/30 focus:ring-2 focus:ring-career-primary focus:outline-none transition-all"
                        value={course} onChange={(e) => setCourse(e.target.value)}
                    />
                </div>
                
                <button 
                  onClick={() => {setDistrict(''); setType(''); setCourse('');}}
                  className="w-full btn-outline mt-4 text-sm"
                >
                  Reset Filters
                </button>
            </div>
        </aside>

        {/* Results Grid */}
        <main className="w-full lg:w-3/4 flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <h1 className="text-3xl font-display font-bold">Directory</h1>
                <span className="text-sm text-white/50">{totalCount} institutions found</span>
            </div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
            >
                {colleges.map((college) => (
                    <motion.div 
                        key={college._id}
                        onClick={() => alert(`Detailed view for ${college.college_name} coming soon!`)}
                        variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
                        className="glass-card p-6 flex flex-col h-full hover:shadow-career-primary/20 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                    >
                        {/* Decorative gradient blob */}
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-career-primary/10 rounded-full blur-2xl group-hover:bg-career-primary/20 transition-colors"></div>

                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className="bg-career-secondary/20 text-career-secondary px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase">
                                {college.type}
                            </span>
                            <span className="text-xs text-white/40 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                {college.district}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-1 relative z-10">{college.college_name}</h3>
                        <p className="text-sm text-white/50 mb-4 font-mono relative z-10">CODE: {college.institute_code}</p>
                        
                        <div className="mt-auto space-y-2 relative z-10">
                            <p className="text-xs text-white/70 font-semibold mb-2">Available Courses:</p>
                            {college.courses.slice(0, 3).map((c, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-1">
                                    <span className="text-white/80 truncate pr-4">{c.course_name}</span>
                                    <span className="text-career-accent font-medium whitespace-nowrap">
                                        {c.previous_cutoff ? `${c.previous_cutoff}%ile` : 'N/A'}
                                    </span>
                                </div>
                            ))}
                            {college.courses.length > 3 && (
                                <div className="text-xs text-center text-career-primary/80 mt-2 font-medium cursor-pointer hover:underline">
                                    + {college.courses.length - 3} more courses
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {!loading && colleges.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center glass-card">
                        <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                        <p className="text-white/50">Try adjusting your filters to find more institutions.</p>
                    </div>
                )}
            </motion.div>

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-career-secondary"></div>
                </div>
            )}

            {!loading && hasMore && (
                <div className="flex justify-center mt-8 pb-12">
                    <button 
                        onClick={() => setPage(prev => prev + 1)}
                        className="btn-primary px-8 py-3 flex items-center gap-2"
                    >
                        Load More Institutions
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            )}
        </main>
    </div>
  );
};

export default CollegeExplorer;
