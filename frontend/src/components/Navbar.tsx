import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Navbar = () => {
  return (
  <nav className="bg-white shadow-lg border-b-4 border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Shield className="h-10 w-10 text-purple-600" />
              <span className="text-2xl font-bold text-primary-700">
                <span className="text-rainbow">CyberQuest</span>
                <span className="ml-1 text-rainbow">Jr.</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="btn-secondary dashboard-btn text-sm font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
