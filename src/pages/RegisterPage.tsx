import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield, User, CheckCircle2 } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { playSound } = useSound();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
    { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
    { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
  ];

  const passwordStrength = passwordRequirements.filter(req => req.test(formData.password)).length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 4) {
      setError('Please meet all password requirements');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);

    const result = await register({
      email: formData.email,
      username: formData.username,
      password: formData.password,
      displayName: formData.displayName || undefined,
    });

    if (result.success) {
      playSound('achievement');
      navigate('/learn');
    } else {
      playSound('click');
      setError(result.error || 'Registration failed. Please try again.');
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
          <h1 className="text-3xl font-bold text-white mb-2">Join CyberQuest</h1>
          <p className="text-white/60">Start your journey to digital safety mastery</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-surface-200/50 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/30 transition-all focus:border-glow-amber/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-glow-amber/20"
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-white/80">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="cyberwarrior123"
                  required
                  minLength={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/30 transition-all focus:border-glow-amber/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-glow-amber/20"
                />
              </div>
            </div>

            {/* Display Name Field */}
            <div className="space-y-2">
              <label htmlFor="displayName" className="block text-sm font-medium text-white/80">
                Display Name <span className="text-white/40">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your display name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/30 transition-all focus:border-glow-amber/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-glow-amber/20"
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 py-3 text-white placeholder-white/30 transition-all focus:border-glow-amber/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-glow-amber/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength >= level
                            ? level <= 1
                              ? 'bg-red-500'
                              : level <= 2
                              ? 'bg-orange-500'
                              : level <= 3
                              ? 'bg-yellow-500'
                              : 'bg-glow-lime'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.label}
                        className={`flex items-center gap-1.5 ${
                          req.test(formData.password) ? 'text-glow-lime' : 'text-white/40'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className={`w-full rounded-xl border bg-white/5 pl-12 pr-4 py-3 text-white placeholder-white/30 transition-all focus:bg-white/10 focus:outline-none focus:ring-2 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                      : 'border-white/10 focus:border-glow-amber/50 focus:ring-glow-amber/20'
                  }`}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange px-6 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:shadow-lg hover:shadow-glow-amber/30 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-200/50 px-4 text-sm text-white/40">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            onClick={() => playSound('click')}
            className="block w-full rounded-xl border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-white/5 hover:border-white/30"
          >
            Sign In Instead
          </Link>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-white/40">
          By creating an account, you agree to learn awesome cybersecurity skills and become a digital safety hero.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
