import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { User, Globe, Lock, ArrowRight, LogIn, Loader2, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import HeroSection from '../components/HeroSection';

interface AuthPageProps {
  formData: any;
  updateFormData: (data: any) => void;
  handleRegister: () => void;
  handleLogin: (email: string, pass: string) => Promise<string>;
}

const AuthPage: React.FC<AuthPageProps> = ({ formData, updateFormData, handleRegister, handleLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });

  const handleSubmit = async () => {
    if (isLoading || showSuccess) return;
    setError('');
    setIsLoading(true);
    
    try {
      if (mode === 'register') {
        await handleRegister();
        setSuccessInfo({ 
          title: 'Account Created!', 
          message: `Welcome, ${formData.name}! Let's set up your profile.` 
        });
        setShowSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Reduced from 2000ms to 800ms
        navigate('/onboarding');
      } else {
        const dest = await handleLogin(formData.email, formData.password);
        setSuccessInfo({ 
          title: 'Login Successful!', 
          message: `Welcome back! Redirecting...` 
        });
        setShowSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 600)); // Further reduced to 600ms
        navigate(dest);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'Authentication failed. Please check your connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex select-none relative overflow-hidden">
      <HeroSection />

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center max-w-sm w-full mx-4 shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">{successInfo.title}</h2>
              <p className="text-neutral-400 mb-6 font-medium">{successInfo.message}</p>
              <div className="flex justify-center">
                <div className="w-12 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="w-full h-full bg-green-500"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col p-6 lg:p-12 max-w-md mx-auto w-full relative justify-center">
        <Logo size="lg" centered />
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 max-w-sm mx-auto w-full"
        >
          <header>
            <h1 className="text-2xl font-bold text-white mb-1">
              {mode === 'register' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-neutral-400 text-sm">
              {mode === 'register' 
                ? 'Fill in the details to start your trading journal.' 
                : 'Login with your credentials to access your dashboard.'}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-900/20 border border-red-900/30 rounded-lg text-red-500 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {mode === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="text-xs font-medium text-neutral-300 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  disabled={isLoading}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                  type="password" 
                  placeholder="**********"
                  disabled={isLoading}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
                  value={formData.password}
                  onChange={(e) => updateFormData({ password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                {mode === 'register' ? 'Create Account' : 'Sign In'} 
                {mode === 'register' ? <ArrowRight size={18} /> : <LogIn size={18} />}
              </>
            )}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-800" /></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-black px-2 text-neutral-500 font-bold">Or continue with</span></div>
          </div>

          <button disabled={isLoading} className="w-full py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50 text-sm">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" referrerPolicy="no-referrer" />
            {mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}
          </button>

          <p className="text-center text-neutral-400 text-xs">
            {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span 
              onClick={() => { if (!isLoading) { setMode(mode === 'register' ? 'login' : 'register'); setError(''); } }}
              className="text-red-500 font-bold cursor-pointer hover:underline"
            >
              {mode === 'register' ? 'Sign in' : 'Register now'}
            </span>
          </p>
        </motion.div>
        <footer className="mt-6 py-4 text-center border-t border-neutral-900">
           <p className="text-[9px] uppercase tracking-widest text-neutral-700 font-black">© 2026 Catat Crypto. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;
