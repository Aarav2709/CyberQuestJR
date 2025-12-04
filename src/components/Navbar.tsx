import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSound } from '../contexts/SoundContext';
import { useAuth } from '../contexts/AuthContext';
import { useLevelInfo, useStreak } from '../hooks/useGamification';
import { User, LogOut, Flame, Trophy, ChevronDown, Zap, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { playSound } = useSound();
  const { user, isAuthenticated, logout } = useAuth();
  const { level, totalXp, levelProgress } = useLevelInfo();
  const { currentStreak } = useStreak();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    playSound('click');
    await logout();
    setShowUserMenu(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="focus-ring group flex items-center gap-3" onClick={() => playSound('click')}>
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-glow-lime to-glow-amber">
                <span className="text-sm font-bold text-black">CQ</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white">CyberQuest</p>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.4em] text-glow-amber">Junior Edition</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" active={isActive('/')} onClick={() => playSound('click')}>
              Home
            </NavLink>
            <NavLink to="/learn" active={isActive('/learn')} onClick={() => playSound('click')}>
              Journey
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/leaderboard" active={isActive('/leaderboard')} onClick={() => playSound('click')}>
                Leaderboard
              </NavLink>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* XP & Level Display */}
                <div className="hidden sm:flex items-center gap-3">
                  {currentStreak > 0 && (
                    <div className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="text-xs font-bold text-orange-400">{currentStreak}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-full border border-glow-amber/30 bg-glow-amber/10 px-3 py-1.5">
                    <Zap className="h-4 w-4 text-glow-amber" />
                    <span className="text-xs font-bold text-glow-amber">{totalXp.toLocaleString()} XP</span>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 rounded-full border border-glow-lime/30 bg-glow-lime/10 px-3 py-1.5">
                      <Trophy className="h-4 w-4 text-glow-lime" />
                      <span className="text-xs font-bold text-glow-lime">Lvl {level}</span>
                    </div>
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-glow-lime to-glow-amber transition-all duration-500"
                        style={{ width: `${levelProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => {
                      playSound('click');
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 focus-ring"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-glow-lime to-glow-amber">
                      <User className="h-3.5 w-3.5 text-black" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user?.displayName || user?.username}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-surface-200/95 p-2 shadow-2xl backdrop-blur-xl animate-fadeIn">
                      <div className="px-3 py-2 border-b border-white/10 mb-2">
                        <p className="text-sm font-semibold text-white truncate">{user?.displayName || user?.username}</p>
                        <p className="text-xs text-white/50 truncate">{user?.email}</p>
                      </div>

                      <div className="sm:hidden space-y-2 px-3 py-2 border-b border-white/10 mb-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">XP</span>
                          <span className="font-bold text-glow-amber">{totalXp.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">Level</span>
                          <span className="font-bold text-glow-lime">{level}</span>
                        </div>
                        {currentStreak > 0 && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">Streak</span>
                            <span className="font-bold text-orange-400">{currentStreak} days</span>
                          </div>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => {
                          playSound('click');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/certificates"
                        onClick={() => {
                          playSound('click');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Trophy className="h-4 w-4" />
                        Certificates
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => playSound('click')}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-white/40 hover:bg-white/5 focus-ring"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => playSound('click')}
                  className="rounded-full bg-gradient-to-r from-glow-lime to-glow-amber px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:shadow-lg hover:shadow-glow-amber/30 focus-ring"
                >
                  Join Now
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                playSound('click');
                setShowMobileMenu(!showMobileMenu);
              }}
              className="md:hidden rounded-xl border border-white/10 p-2 text-white transition-colors hover:bg-white/10 focus-ring"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-fadeIn">
            <div className="flex flex-col gap-2">
              <MobileNavLink to="/" active={isActive('/')} onClick={() => { playSound('click'); setShowMobileMenu(false); }}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/learn" active={isActive('/learn')} onClick={() => { playSound('click'); setShowMobileMenu(false); }}>
                Journey
              </MobileNavLink>
              {isAuthenticated && (
                <MobileNavLink to="/leaderboard" active={isActive('/leaderboard')} onClick={() => { playSound('click'); setShowMobileMenu(false); }}>
                  Leaderboard
                </MobileNavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

function NavLink({ to, active, onClick, children }: { to: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all focus-ring ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, active, onClick, children }: { to: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;

