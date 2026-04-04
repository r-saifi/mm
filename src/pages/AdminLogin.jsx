import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeSimple, LockKey, Eye, EyeSlash, SignIn } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (currentUser) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Failed to sign in. Please try again.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Invalid email or password.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgMain flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.12)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-accent rounded-xl p-2">
              <img src="/images/new_logo.png" alt="Logo" className="h-10 w-auto" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <span className="text-2xl font-display font-black uppercase tracking-tighter text-textMain">DESIGN</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-textMain">Admin Portal</h1>
          <p className="text-textMuted mt-2">Sign in to manage your portfolio</p>
        </div>

        {/* Card */}
        <div className="glass p-8 rounded-3xl border border-glassBorder shadow-glass">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wider text-textMuted">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeSimple
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mmdesign.com"
                  required
                  className="w-full bg-transparent border border-glassBorder rounded-xl pl-11 pr-4 py-3.5 text-textMain placeholder:text-textMuted/60 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-textMuted">
                Password
              </label>
              <div className="relative">
                <LockKey
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none"
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border border-glassBorder rounded-xl pl-11 pr-12 py-3.5 text-textMain placeholder:text-textMuted/60 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-accent transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 w-full bg-accent text-white font-semibold py-4 rounded-xl hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(var(--accent-rgb),0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <SignIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-textMuted/50 text-xs mt-6">
          MM Design Studio · Admin Access Only
        </p>
      </motion.div>
    </div>
  );
}
