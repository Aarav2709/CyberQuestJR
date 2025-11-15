import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI } from '../services/api';
import { Progress } from '../types';
import {
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  Play,
  Sparkles,
  Clock,
  Shield,
  Search,
  Lock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [personalizedCourse, setPersonalizedCourse] = useState<any>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressAPI.getProgress();
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check for personalized course and assessment
    const courseData = localStorage.getItem('personalized_course');

    if (courseData) {
      setPersonalizedCourse(JSON.parse(courseData));
    }

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Your Cyber Adventure
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Ready to continue your cybersecurity adventure? No account needed!
          </p>
          {progress && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{progress.message}</p>
            </div>
          )}
        </div>

        {/* Personalized Course Section */}
        {personalizedCourse && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-2xl p-8 border-4 border-green-200 dark:border-green-700">
              <div className="flex items-center mb-6">
                <Sparkles className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-green-800 dark:text-green-200">
                  Your AI-Generated Learning Path
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {personalizedCourse.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {personalizedCourse.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    personalizedCourse.skill_level === 'advanced' ? 'bg-yellow-100 text-yellow-800' :
                    personalizedCourse.skill_level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {personalizedCourse.skill_level} level
                  </span>
                  <span className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {personalizedCourse.estimated_duration}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalizedCourse.modules && personalizedCourse.modules.map((module: any, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl font-semibold text-purple-600">
                          {module.name?.charAt(0) || 'M'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{module.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{module.description}</p>
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{module.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/modules"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start My Learning Adventure</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Learning Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">
              {progress?.available_modules || 6} Gaming Modules
            </h3>
            <p className="text-purple-100">Interactive Adventures</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300">
            <Star className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">AI-Powered</h3>
            <p className="text-blue-100">Personalized Challenges</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Unlimited</h3>
            <p className="text-yellow-100">Fun & Learning</p>
          </div>
        </div>

        {/* Gaming Modules Preview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Interactive Gaming Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <Lock className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Heroes</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Become a password superhero and create unbreakable digital fortresses!</p>
              <Link to="/modules/password-basics" className="text-purple-600 hover:text-purple-800 font-medium">Start Adventure →</Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <Search className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phishing Detective</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Train your detective skills to spot and avoid phishing attempts!</p>
              <Link to="/modules/phishing-awareness" className="text-purple-600 hover:text-purple-800 font-medium">Start Adventure →</Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <Shield className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Privacy Guardian</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Master the art of protecting your personal information online!</p>
              <Link to="/modules/privacy-guardian" className="text-purple-600 hover:text-purple-800 font-medium">Start Adventure →</Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Quick Actions</h2>

          <div className="max-w-lg mx-auto">
            <div className="flex justify-center">
              <Link
                to="/modules"
                className="flex items-center p-6 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-800 dark:to-rose-800 rounded-xl hover:from-pink-200 hover:to-rose-200 dark:hover:from-pink-700 dark:hover:to-rose-700 transition-all duration-300 group w-full max-w-md"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-white">Browse All Modules</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Explore all gaming adventures</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Fun Fact</h2>
          <p className="text-xl">
            Cybersecurity heroes help protect over 4.6 billion internet users worldwide.
            You're joining an amazing community of digital defenders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
