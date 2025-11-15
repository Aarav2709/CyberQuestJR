import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Zap,
  Users,
  Award,
  ArrowRight,
  Star,
  Brain,
  Lock,
  Search,
  Globe,
  Smartphone
} from 'lucide-react';

const Home: React.FC = () => {
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed initial assessment
    const assessmentCompleted = localStorage.getItem('assessment_completed');
    setHasCompletedAssessment(!!assessmentCompleted);
  }, []);

  const startAssessment = () => {
    // Clear any previous assessment data
    localStorage.removeItem('assessment_completed');
    localStorage.removeItem('personalized_course');
    navigate('/quiz/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 dark:text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <Shield className="h-24 w-24 text-purple-600 animate-pulse" />
                <Star className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
                <Zap className="h-6 w-6 text-orange-400 absolute -bottom-1 -left-1 animate-pulse" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
              CyberQuest Jr
            </h1>

            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8 font-bold">
              The super fun way to learn cybersecurity
            </p>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of young cyber heroes (ages 8-18) on an exciting adventure to protect the digital world!
              {!hasCompletedAssessment
                ? " First, let's see what you already know with a quick assessment!"
                : " Continue your personalized cybersecurity journey!"
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {!hasCompletedAssessment ? (
                <button
                  onClick={startAssessment}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30 inline-flex items-center space-x-2"
                >
                  <Brain className="h-6 w-6" />
                  <span>Start Assessment Quiz</span>
                  <ArrowRight className="h-6 w-6" />
                </button>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30 inline-flex items-center space-x-2"
                  >
                    <Shield className="h-6 w-6" />
                    <span>Continue Learning</span>
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={startAssessment}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30 inline-flex items-center space-x-2"
                  >
                    <Brain className="h-6 w-6" />
                    <span>Retake Assessment</span>
                    <ArrowRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4">Why Choose CyberQuest Jr?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Perfect for young minds aged 8-18!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-yellow-300 to-orange-400 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/50">
              <Zap className="h-16 w-16 text-orange-800 mb-4 mx-auto" />
              <h3 className="text-2xl font-black text-orange-900 mb-4 text-center">AI-Powered Learning</h3>
              <p className="text-orange-800 text-center font-semibold">
                Smart quizzes that adapt to your learning style and help you grow stronger every day.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-300 to-emerald-400 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/50">
              <Shield className="h-16 w-16 text-green-800 mb-4 mx-auto" />
              <h3 className="text-2xl font-black text-green-900 mb-4 text-center">Cyber Safety Skills</h3>
              <p className="text-green-800 text-center font-semibold">
                Learn to protect yourself from online dangers with fun, easy-to-understand lessons.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-300 to-rose-400 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/50">
              <Users className="h-16 w-16 text-pink-800 mb-4 mx-auto" />
              <h3 className="text-2xl font-black text-pink-900 mb-4 text-center">Safe Community</h3>
              <p className="text-pink-800 text-center font-semibold">
                Join a friendly community of young cyber heroes from around the world.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-300 to-violet-400 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/50">
              <Award className="h-16 w-16 text-purple-800 mb-4 mx-auto" />
              <h3 className="text-2xl font-black text-purple-900 mb-4 text-center">Gamified Fun</h3>
              <p className="text-purple-800 text-center font-semibold">
                Earn badges, climb leaderboards, and show off your cyber skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6">Learning Modules</h2>
            <p className="text-xl opacity-90">Fun adventures that teach real cybersecurity skills.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Password Heroes</h3>
              <p className="text-center opacity-90">Create super-strong passwords that protect your digital world!</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Phishing Detective</h3>
              <p className="text-center opacity-90">Spot fake emails and websites like a true detective!</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all">
              <div className="flex justify-center mb-4">
                <Globe className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Digital Footprints</h3>
              <p className="text-center opacity-90">Learn what traces you leave online and how to manage them!</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all">
              <div className="flex justify-center mb-4">
                <Smartphone className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Social Media Safety</h3>
              <p className="text-center opacity-90">Have fun on social media while staying safe!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-8">Ready to Become a Cyber Hero?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of young adventurers learning to protect the digital world. It's free, fun, and educational!
          </p>

          {/* Removed user check - always show call to action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/modules"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30"
            >
              Start Learning Now
            </Link>
            <Link
              to="/quiz"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30"
            >
              Take a Quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
