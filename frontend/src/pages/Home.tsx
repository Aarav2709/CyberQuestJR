import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Users, Award, ArrowRight, Star, Brain } from 'lucide-react';

const Home = () => {
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
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 via-blue-100 via-pink-100 to-purple-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 dark:text-white">
          <section className="relative overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
              <div className="text-center">
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <Shield className="h-24 w-24 text-purple-600" />
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg px-4">
                  CyberQuest Jr.
                </h1>

                <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-6 font-bold">
                  The friendly way to learn cybersecurity for kids!
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Join other young learners on a bright and safe journey to understand online safety and basic cybersecurity skills.
                  {!hasCompletedAssessment
                    ? " Start with a short assessment to personalize your learning path."
                    : " Continue your personalized learning journey."
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                  {!hasCompletedAssessment ? (
                    <button
                      onClick={startAssessment}
                      className="btn-secondary inline-flex items-center space-x-2 text-lg"
                    >
                      <Brain className="h-5 w-5" />
                      <span>Start Assessment</span>
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="btn-secondary inline-flex items-center space-x-2 text-lg"
                      >
                        <Shield className="h-5 w-5" />
                        <span>Continue Learning</span>
                      </Link>
                      <button
                        onClick={startAssessment}
                        className="btn-secondary inline-flex items-center space-x-2 text-lg"
                      >
                        <Brain className="h-5 w-5" />
                        <span>Retake Assessment</span>
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
              <div className="bg-gradient-to-br from-yellow-300 to-orange-400 p-8 rounded-3xl shadow-2xl border-4 border-white/50">
                <Zap className="h-16 w-16 text-white mb-4 mx-auto" />
                <h3 className="text-2xl font-black text-orange-900 mb-4 text-center">AI-Powered Learning</h3>
                <p className="text-orange-800 text-center font-semibold">Smart quizzes that adapt to your learning style and help you grow stronger every day.</p>
              </div>

              <div className="bg-gradient-to-br from-green-300 to-emerald-400 p-8 rounded-3xl shadow-2xl border-4 border-white/50">
                <Shield className="h-16 w-16 text-white mb-4 mx-auto" />
                <h3 className="text-2xl font-black text-green-900 mb-4 text-center">Cyber Safety Skills</h3>
                <p className="text-green-800 text-center font-semibold">Learn to protect yourself from online dangers with fun, easy-to-understand lessons.</p>
              </div>

              <div className="bg-gradient-to-br from-pink-300 to-rose-400 p-8 rounded-3xl shadow-2xl border-4 border-white/50">
                <Users className="h-16 w-16 text-white mb-4 mx-auto" />
                <h3 className="text-2xl font-black text-pink-900 mb-4 text-center">Safe Community</h3>
                <p className="text-pink-800 text-center font-semibold">Join a friendly community of young learners from around the world.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-300 to-violet-400 p-8 rounded-3xl shadow-2xl border-4 border-white/50">
                <Award className="h-16 w-16 text-white mb-4 mx-auto" />
                <h3 className="text-2xl font-black text-purple-900 mb-4 text-center">Gamified Fun</h3>
                <p className="text-purple-800 text-center font-semibold">Earn badges, climb leaderboards, and celebrate progress.</p>
              </div>
            </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-6">Learning Modules!</h2>
            <p className="text-xl opacity-90">Fun adventures that teach real cybersecurity skills!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition">
                <Shield className="h-12 w-12 mb-4 text-white mx-auto" />
              <h3 className="text-xl font-bold mb-3 text-center">Password Heroes</h3>
              <p className="text-center opacity-90">Create super-strong passwords that protect your digital world!</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition">
              <Zap className="h-12 w-12 mb-4 text-white mx-auto" />
              <h3 className="text-xl font-bold mb-3 text-center">Phishing Detective</h3>
              <p className="text-center opacity-90">Spot fake emails and websites like a true detective!</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition">
              <Star className="h-12 w-12 mb-4 text-white mx-auto" />
              <h3 className="text-xl font-bold mb-3 text-center">Digital Footprints</h3>
              <p className="text-center opacity-90">Learn what traces you leave online and how to manage them!</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition">
              <Users className="h-12 w-12 mb-4 text-white mx-auto" />
              <h3 className="text-xl font-bold mb-3 text-center">Social Media Safety</h3>
              <p className="text-center opacity-90">Have fun on social media while staying safe!</p>
            </div>
          </div>
        </div>
      </section>

  {/* Removed unused 'Ready to Become a Cyber Hero?' call-to-action section as requested */}
    </div>
  );
};

export default Home;
