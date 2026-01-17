import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register } from '../api';
import { 
  AlertCircle, Loader2, User, Mail, 
  Lock, Fingerprint, Ticket, ArrowRight 
} from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: '',
    inviteCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLogin 
        ? await login({ email: formData.email, password: formData.password })
        : await register(formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('profile', JSON.stringify(response.data));
      window.location.href = '/dashboard'; 
    } catch (err) {
      const message = err.response?.data?.message || "Connection failed. Please check your network.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        {/* Animated Outer Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-20" />
        
        <div className="relative bg-[#0d0d10] border border-white/10 p-10 rounded-[2.5rem] shadow-3xl backdrop-blur-xl">
          <header className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/40"
            >
              <Fingerprint className="text-white" size={32} />
            </motion.div>
            <h2 className="text-4xl text-white font-black tracking-tighter">
              {isLogin ? 'Sign In' : 'Join CICR'}
            </h2>
            <p className="text-gray-500 mt-3 text-sm font-medium tracking-wide uppercase">
              {isLogin ? 'Welcome back to the hub' : 'Create your lab profile'}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 flex items-center gap-3 text-xs font-semibold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <InputGroup icon={User} name="name" placeholder="Full Name" onChange={handleChange} />
                  <InputGroup icon={Hash} name="collegeId" placeholder="College ID" onChange={handleChange} />
                  <InputGroup icon={Ticket} name="inviteCode" placeholder="Access Code" onChange={handleChange} />
                </motion.div>
              )}
            </AnimatePresence>

            <InputGroup icon={Mail} name="email" type="email" placeholder="Email Address" onChange={handleChange} />
            <InputGroup icon={Lock} name="password" type="password" placeholder="Password" onChange={handleChange} />

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-xl shadow-blue-600/20 mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Authenticate' : 'Complete Entry'} 
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="text-center mt-10">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 hover:text-blue-500 transition-all"
            >
              {isLogin ? "Generate New Account" : "Return to Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Sub-component for Inputs to keep the main return clean
function InputGroup({ icon: Icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
        <Icon size={18} />
      </div>
      <input 
        required
        {...props}
        className="w-full bg-[#08080a] border border-white/5 p-4 pl-12 rounded-2xl text-white text-sm outline-none focus:border-blue-600/50 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-700"
      />
    </div>
  );
}

// Simple Hash Icon since lucide-react might not export it directly as Hash in all versions
const Hash = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);