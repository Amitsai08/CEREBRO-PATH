import { motion } from 'framer-motion';

const exams = [
    { name: "MHT-CET (PCM)", date: "April 16 - 23, 2026", status: "Registration Open", link: "https://cetcell.mahacet.org/" },
    { name: "MHT-CET (PCB)", date: "April 24 - 30, 2026", status: "Registration Open", link: "https://cetcell.mahacet.org/" },
    { name: "NEET UG", date: "May 4, 2026", status: "Form Out", link: "https://neet.ntaneet.nic.in/" },
    { name: "JEE Main (Session 2)", date: "April 4 - 15, 2026", status: "Admit Card Out", link: "https://jeemain.nta.ac.in/" },
    { name: "MAH-MBA-CET", date: "March 2026", status: "Ended", link: "https://cetcell.mahacet.org/" },
];

const EntranceExamTracker = () => {
    return (
        <div className="flex flex-col gap-12 w-full py-8">
            <header className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Maharashtra <span className="text-career-secondary">Exam Tracker</span></h1>
                <p className="text-white/40 leading-relaxed">Stay ahead of the curve with real-time updates on upcoming entrance examinations. Never miss a deadline again.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exams.map((exam, i) => (
                    <motion.div 
                        key={exam.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-8 border border-white/5 hover:border-career-secondary/30 transition-all flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                                exam.status === 'Registration Open' ? 'bg-green-500/20 text-green-400' : 
                                exam.status === 'Ended' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                                {exam.status}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{exam.name}</h3>
                        <p className="text-career-secondary font-mono text-sm mb-8">{exam.date}</p>
                        
                        <div className="mt-auto pt-6 border-t border-white/5">
                            <a 
                                href={exam.link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex justify-between items-center text-sm font-bold text-white group"
                            >
                                Official Portal 
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="glass-card p-12 bg-gradient-to-r from-career-primary/10 to-transparent border border-career-primary/20 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h4 className="text-2xl font-bold mb-2">Want SMS Alerts?</h4>
                    <p className="text-white/40">Subscribe to our automated alert system for deadline reminders.</p>
                </div>
                <button className="btn-primary px-8 py-3 rounded-xl whitespace-nowrap">Notify Me</button>
            </section>
        </div>
    );
};

export default EntranceExamTracker;
