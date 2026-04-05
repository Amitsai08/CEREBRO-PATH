import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const Profile = () => {
  const { user, studentProfile, setStudentProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: studentProfile?.name || user?.displayName || '',
    email: studentProfile?.email || user?.email || '',
    district: studentProfile?.district || '',
    category: studentProfile?.category || '',
    class_level: studentProfile?.academic_info?.class_level || '10th',
    marks_percentile: studentProfile?.academic_info?.marks_percentile || '',
    subjects: studentProfile?.academic_info?.subjects?.join(', ') || '',
    preferred_stream: studentProfile?.interests?.preferred_stream || '',
    career_interests: studentProfile?.interests?.career_interests?.join(', ') || '',
    preferred_districts: studentProfile?.preferences?.preferred_districts?.join(', ') || '',
  });

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        uid: user?.uid || 'demo-user',
        name: form.name,
        email: form.email,
        district: form.district,
        category: form.category,
        academic_info: {
          class_level: form.class_level,
          marks_percentile: parseFloat(form.marks_percentile) || 0,
          subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
        },
        interests: {
          preferred_stream: form.preferred_stream,
          career_interests: form.career_interests.split(',').map(s => s.trim()).filter(Boolean),
        },
        preferences: {
          preferred_districts: form.preferred_districts.split(',').map(s => s.trim()).filter(Boolean),
        },
      };
      const res = await axios.post(`${API_BASE_URL}/students`, payload);
      setStudentProfile(res.data);
      setStep(3); // success
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const steps = [
    {
      title: 'Personal Details',
      fields: (
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(v) => update('name', v)} />
          <Input label="Email" value={form.email} onChange={(v) => update('email', v)} type="email" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="District" value={form.district} onChange={(v) => update('district', v)}
              options={['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Thane', 'Other']} />
            <Select label="Category" value={form.category} onChange={(v) => update('category', v)}
              options={['Open', 'OBC', 'SC', 'ST', 'NT', 'SBC', 'VJ/DT']} />
          </div>
        </div>
      )
    },
    {
      title: 'Academic Information',
      fields: (
        <div className="space-y-4">
          <Select label="Class Level" value={form.class_level} onChange={(v) => update('class_level', v)} options={['10th', '12th']} />
          <Input label="Marks / Percentile" value={form.marks_percentile} onChange={(v) => update('marks_percentile', v)} type="number" placeholder="e.g. 85.5" />
          {form.class_level === '10th' && (
            <>
              <Select label="FYJC Registered?" value={form.is_fyjc_registered ? 'Yes' : 'No'} 
                onChange={(v) => update('is_fyjc_registered', v === 'Yes')} options={['Yes', 'No']} />
              <Input label="Registration Number" value={form.fyjc_registration_number} 
                onChange={(v) => update('fyjc_registration_number', v)} placeholder="e.g. MH12345" />
              <Select label="College Type Preference" value={form.college_type_preference} 
                onChange={(v) => update('college_type_preference', v)} options={['Government', 'Aided', 'Unaided', 'Any']} />
            </>
          )}
          <Input label="Subjects (comma separated)" value={form.subjects} onChange={(v) => update('subjects', v)} placeholder="e.g. Maths, Physics, Chemistry" />
        </div>
      )
    },
    {
      title: 'Interests & Preferences',
      fields: (
        <div className="space-y-4">
          <Select label="Preferred Stream" value={form.preferred_stream} onChange={(v) => update('preferred_stream', v)}
            options={['Science', 'Commerce', 'Arts', 'Diploma', 'Undecided']} />
          <Input label="Career Interests (comma separated)" value={form.career_interests} onChange={(v) => update('career_interests', v)}
            placeholder="e.g. Software Engineer, Data Scientist" />
          <Input label="Preferred Districts (comma separated)" value={form.preferred_districts} onChange={(v) => update('preferred_districts', v)}
            placeholder="e.g. Mumbai, Pune" />
        </div>
      )
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto w-full min-h-[75vh] flex flex-col">
      <h2 className="text-3xl font-display font-bold mb-2">Student Profile</h2>
      <p className="text-white/50 text-sm mb-8">Complete your profile to get personalized recommendations</p>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-career-primary text-white' : 'bg-white/10 text-white/40'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-xs text-white/40 hidden sm:block">{s.title}</span>
          </div>
        ))}
      </div>

      {step < 3 ? (
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 flex-grow">
          <h3 className="text-xl font-semibold mb-6">{steps[step].title}</h3>
          {steps[step].fields}
          <div className="flex gap-3 mt-8">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-outline flex-1">Back</button>}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">Continue</button>
            ) : (
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center text-3xl">✓</div>
          <h3 className="text-2xl font-bold mb-2">Profile Saved!</h3>
          <p className="text-white/50 mb-6">Your personalized recommendations are being generated.</p>
          <a href="/dashboard" className="btn-primary inline-block">Go to Dashboard</a>
        </motion.div>
      )}
    </motion.div>
  );
};

/* ─── Reusable Form Components ─── */
const Input = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:ring-2 focus:ring-career-primary focus:outline-none transition-all" />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-career-primary focus:outline-none transition-all">
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default Profile;
