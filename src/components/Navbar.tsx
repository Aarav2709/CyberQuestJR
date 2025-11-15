import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg border-b-4 border-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                CyberQuest Jr.
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/modules"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </Link>

            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-primary-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
