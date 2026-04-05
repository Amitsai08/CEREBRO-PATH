import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative w-full -mt-6">
      {/* ── Hero Section ── */}
      <section className="relative h-[85vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden rounded-b-[4rem]">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 z-0 scale-105 animate-subtle-zoom"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(13, 14, 18, 0.4), rgba(13, 14, 18, 0.95)), url('/brain/46ffb441-9eb0-428f-9211-b8053f4d7acf/career_hero_bg_1773680788198.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Floating Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-career-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-career-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase border border-career-primary/30 rounded-full bg-career-primary/10 text-career-primary">
              AI-Powered Career Intelligence
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tight"
          >
            Design Your <br />
            <span className="bg-gradient-to-r from-career-primary via-white to-career-secondary bg-clip-text text-transparent">
              Perfect Future
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The most advanced career guidance platform tailored specifically for Maharashtra students. Discover your path with Cerebro-powered AI.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/login" className="btn-primary group relative overflow-hidden px-10 py-4 text-lg">
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link to="/explore" className="btn-outline px-10 py-4 text-lg hover:bg-white/5">
                Explore Colleges
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Path Selector Section ── */}
      <section className="py-24 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        <PathCard 
            title="10th Students" 
            desc="Choosing your stream? Let Cerebro analyze your aptitude and interest to find the perfect match between Science, Commerce, Arts, or Diploma."
            link="/questionnaire/10th"
            icon="🎓"
            color="from-career-primary to-blue-600"
            delay={0.2}
        />
        <PathCard 
            title="12th Students" 
            desc="Ready for degree? Get AI-driven recommendations for Engineering, Medical, Pharmacy, and 50+ other career paths based on your performance."
            link="/questionnaire/12th"
            icon="🚀"
            color="from-career-secondary to-purple-600"
            delay={0.4}
        />
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 bg-black/30 w-screen relative left-1/2 -translate-x-1/2">
        <div className="max-w-7xl mx-auto px-4 md:px-12 text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-16 tracking-tight">Intelligence Meets <span className="bg-gradient-to-r from-career-primary to-blue-400 bg-clip-text text-transparent">Guidance</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard icon="🧠" title="Integrated Aptitude" desc="10 logical games and 30+ field questions to map your cognitive profile." />
                <FeatureCard icon="📊" title="Live Analytics" desc="Track admission cutoffs and market demands in real-time across Maharashtra." />
                <FeatureCard icon="🤖" title="AI Counselor" desc="Talk to our Cerebro AI for personalized advice anytime, anywhere." />
            </div>
        </div>
      </section>

      {/* ── How It Works (New) ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-12 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-career-secondary/5 rounded-full blur-[100px]" />
          <h2 className="text-4xl font-display font-bold mb-20 text-center">Your Journey to <span className="text-career-secondary">Success</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-white/5 z-0" />
              <StepItem step="01" title="Register" desc="Create your profile and tell us about your goals." />
              <StepItem step="02" title="Assessment" desc="Complete our AI-powered logic and interest test." />
              <StepItem step="03" title="Insight" desc="Receive detailed career recommendations via Groq AI." />
              <StepItem step="04" title="Admission" desc="Explore top colleges and track live admission cutoffs." />
          </div>
      </section>

      {/* ── Call to Action (New) ── */}
      <section className="py-32 bg-gradient-to-br from-career-primary/20 to-career-dark rounded-[4rem] text-center px-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">Ready to Start?</h2>
              <p className="text-xl text-white/60 max-w-xl mx-auto mb-12">Join 10,000+ students in Maharashtra shaping their future with Cerebro Path.</p>
              <Link to="/login" className="btn-primary px-12 py-5 text-xl rounded-2xl shadow-emerald-500/20 shadow-2xl">
                  Get Started for Free
              </Link>
          </motion.div>
      </section>
    </div>
  );
};

const PathCard = ({ title, desc, link, icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: delay > 0.3 ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        className="glass-card p-1 relative overflow-hidden group cursor-pointer"
    >
        <Link to={link} className="block p-8 h-full bg-career-dark/40 rounded-3xl transition-colors hover:bg-white/5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {icon}
            </div>
            <h3 className="text-3xl font-display font-bold mb-4">{title}</h3>
            <p className="text-white/60 leading-relaxed mb-8">{desc}</p>
            <div className={`inline-flex items-center gap-2 font-bold tracking-widest text-xs uppercase bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
                Start Path Assessment <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
        </Link>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card p-10 hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-career-primary/30">
        <div className="text-5xl mb-8">{icon}</div>
        <h4 className="text-2xl font-bold mb-4">{title}</h4>
        <p className="text-white/40 text-base leading-relaxed">{desc}</p>
    </div>
);

const StepItem = ({ step, title, desc }) => (
    <div className="relative z-10 flex flex-col items-center text-center p-6 group">
        <div className="w-20 h-20 rounded-full bg-career-dark border-2 border-career-secondary flex items-center justify-center text-2xl font-black mb-6 group-hover:bg-career-secondary group-hover:text-black transition-all duration-500 shadow-xl shadow-career-secondary/10">
            {step}
        </div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
    </div>
);

export default Home;

