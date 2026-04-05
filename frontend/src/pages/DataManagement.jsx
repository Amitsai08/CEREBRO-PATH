import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DataManagement = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, extracting, saving, complete
  const [extractedColleges, setExtractedColleges] = useState([]);
  const [message, setMessage] = useState('');

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
        const res = await axios.post('http://localhost:5000/api/admin/upload-pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.colleges) {
            setExtractedColleges(res.data.colleges);
            setStatus('complete');
            setMessage(`Extracted ${res.data.colleges.length} colleges successfully!`);
        } else if (res.data.rawText) {
            setMessage("Groq API key not found. Here is a preview of the extracted text:");
            setMessage(prev => prev + "\n\n" + res.data.rawText);
            setStatus('idle');
        }
    } catch (error) {
        console.error("Upload error", error);
        setStatus('idle');
        setMessage("Error processing PDF. Ensure you have added your GROQ_API_KEY to the backend .env");
    }
  };

  const handleSaveAll = async () => {
    setStatus('saving');
    try {
        const res = await axios.post('http://localhost:5000/api/admin/bulk-save', {
            colleges: extractedColleges
        });
        setMessage(`Saved successfully! ${res.data.inserted} new colleges added, ${res.data.updated} updated.`);
        setExtractedColleges([]);
        setStatus('complete');
    } catch (error) {
        console.error("Save error", error);
        setStatus('complete');
        setMessage("Error saving to database.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
            <h1 className="text-4xl font-display font-bold mb-2">AI Data Ingester</h1>
            <p className="text-white/50">Upload official CET/DTE PDFs to auto-populate your database using Groq AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-1">
                <div className="glass-card p-8 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-career-primary/10 rounded-full flex items-center justify-center mb-4 text-career-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">Upload Admission PDF</h3>
                    <p className="text-xs text-white/40 mb-6 font-mono">Supports Seat Matrix, Merit Lists, etc.</p>
                    
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handleFileChange}
                        className="hidden" 
                        id="pdf-upload"
                    />
                    <label 
                        htmlFor="pdf-upload" 
                        className="btn-outline cursor-pointer mb-4 w-full"
                    >
                        {file ? file.name : 'Select File'}
                    </label>

                    <button 
                        onClick={handleUpload}
                        disabled={!file || status !== 'idle'}
                        className={`btn-primary w-full ${(!file || status !== 'idle') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {status === 'idle' ? 'Start Processing' : 'Processing...'}
                    </button>

                    {status !== 'idle' && (
                        <div className="mt-6 w-full text-left">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-career-primary font-bold uppercase tracking-widest">{status}</span>
                                <span className="text-xs text-white/30 italic">Step {status === 'uploading' ? '1/3' : status === 'extracting' ? '2/3' : '3/3'}</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="bg-career-primary h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: status === 'uploading' ? '30%' : status === 'extracting' ? '70%' : '100%' }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-4 rounded-xl text-sm font-medium border ${message.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-career-primary/10 border-career-primary/20 text-career-primary'}`}
                    >
                        <div className="whitespace-pre-wrap">{message}</div>
                    </motion.div>
                )}
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                    {extractedColleges.length > 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-end">
                                <h2 className="text-2xl font-bold">Extracted Records ({extractedColleges.length})</h2>
                                <button onClick={handleSaveAll} disabled={status === 'saving'} className="btn-primary">
                                    {status === 'saving' ? 'Saving...' : 'Inject into Database'}
                                </button>
                            </div>

                            <div className="glass-card overflow-hidden">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-white/5 text-white/50 uppercase text-[10px] tracking-widest">
                                        <tr>
                                            <th className="p-4 border-b border-white/5">College Name</th>
                                            <th className="p-4 border-b border-white/5">Code</th>
                                            <th className="p-4 border-b border-white/5">District</th>
                                            <th className="p-4 border-b border-white/5">Courses</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {extractedColleges.map((col, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-medium">{col.college_name}</td>
                                                <td className="p-4 font-mono text-career-primary">{col.institute_code}</td>
                                                <td className="p-4">{col.district}</td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {col.courses?.slice(0, 2).map((c, i) => (
                                                            <span key={i} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">{c.course_name}</span>
                                                        ))}
                                                        {col.courses?.length > 2 && <span className="text-[10px] text-white/30">+{col.courses.length - 2}</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center glass-card text-white/20 border-2 border-dashed border-white/5">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <h3 className="text-xl font-bold">No Data Preview</h3>
                            <p className="mt-2 text-sm max-w-xs mx-auto">Upload a PDF on the left to see the AI extraction results here before saving them to your database.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
};

export default DataManagement;
