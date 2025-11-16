import { Link } from 'react-router-dom';
import { useSound } from '../contexts/SoundContext';

const Navbar: React.FC = () => {
  const { playSound } = useSound();

  return (
    <nav className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="focus-ring">
            <p className="text-base font-semibold uppercase tracking-[0.6em]" style={{ color: 'var(--text-primary)' }}>CyberQuest Jr</p>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/learn"
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] focus-ring transition-all hover:scale-105"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              onClick={() => playSound('click')}
            >
              Journey
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

