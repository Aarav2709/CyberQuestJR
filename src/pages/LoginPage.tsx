import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { playSound } = useSound();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      playSound('achievement');
      navigate('/learn');
    } else {
      playSound('click');
      setError(result.error || 'Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 grid-spark opacity-20" aria-hidden />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-glow-lime to-glow-amber mb-6">
            <Shield className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to continue your cybersecurity journey</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-surface-200/50 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/80">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-white placeholder-white/30 transition-all focus:border-glow-amber/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-glow-amber/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 py-3.5 text-white placeholder-white/30 transition-all focus:border-glow-amber/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-glow-amber/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange px-6 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:shadow-lg hover:shadow-glow-amber/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-200/50 px-4 text-sm text-white/40">New to CyberQuest?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            onClick={() => playSound('click')}
            className="block w-full rounded-xl border border-white/20 px-6 py-4 text-center text-sm font-semibold text-white transition-all hover:bg-white/5 hover:border-white/30"
          >
            Create an Account
          </Link>
        </div>

        {/* Guest Mode */}
        <p className="mt-6 text-center text-sm text-white/40">
          Want to explore first?{' '}
          <Link to="/learn" className="text-glow-amber hover:underline" onClick={() => playSound('click')}>
            Browse as guest
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
