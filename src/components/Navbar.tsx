import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/5 bg-night/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="focus-ring">
            <p className="text-base font-semibold uppercase tracking-[0.6em] text-white">CyberQuest Jr</p>
          </Link>

          <Link
            to="/learn"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white focus-ring hover:border-white/60"
          >
            Journey
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
