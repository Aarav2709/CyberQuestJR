import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';

const stats = [
  { value: '6+', label: 'Interactive Chapters' },
  { value: '24+', label: 'In-depth Lessons' },
  { value: '50+', label: 'Practice Scenarios' },
  { value: '100%', label: 'Free Forever' },
];

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { playSound } = useSound();

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-spark opacity-30" aria-hidden />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-glow-amber/10 via-transparent to-transparent blur-3xl" aria-hidden />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-glow-lime animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              Designed for ages 11-17
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
            <span className="text-white">Build </span>
            <span className="text-gradient">hacker-proof</span>
            <br />
            <span className="text-white">habits before high school</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            CyberQuest Jr is your cozy training base for digital safety. Learn through real scenarios,
            build lasting skills, and become the security expert in your friend group.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={isAuthenticated ? '/learn' : '/register'}
              onClick={() => playSound('click')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange px-8 py-4 text-sm font-bold uppercase tracking-wider text-black shadow-lg shadow-glow-amber/20 transition-all hover:shadow-xl hover:shadow-glow-amber/30 hover:-translate-y-0.5"
            >
              {isAuthenticated ? 'Continue Learning' : 'Start Your Quest'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/learn"
              onClick={() => playSound('click')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/5 hover:border-white/30"
            >
              Browse Chapters
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <p className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</p>
              <p className="mt-2 text-xs sm:text-sm text-white/50 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
