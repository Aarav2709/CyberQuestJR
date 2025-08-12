import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, userAPI } from '../services/api';

interface Course {
  title: string;
  description: string;
  icon: string;
  level: string;
  estimatedTime: string;
}

interface UserProgress {
  completed_courses: number;
  total_courses: number;
  average_score: number;
  eligible_for_certificate: boolean;
  certificate: any;
  progress: Record<string, any>;
}

const Dashboard = () => {
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('cyberquest_user_id');
  const userName = localStorage.getItem('cyberquest_user_name') || 'Cyber Hero';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load courses
      const coursesData = await courseAPI.getCourses();
      console.log('Courses loaded:', coursesData);
      setCourses(coursesData.courses || {});

      // Load progress if user exists
      if (userId) {
        try {
          const progressData = await userAPI.getUserProgress(parseInt(userId));
          setProgress(progressData);
        } catch (error) {
          console.log('No progress data yet');
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback courses if API fails
      setCourses({
        "password-basics": {
          title: "Password Heroes",
          description: "Learn to create super strong passwords that protect your digital world like a superhero shield!",
          icon: "🔐",
          level: "Beginner",
          estimatedTime: "15 min"
        },
        "phishing-awareness": {
          title: "Phishing Detective",
          description: "Become an expert detective at spotting fake emails and suspicious messages that try to trick you!",
          icon: "🕵️",
          level: "Beginner",
          estimatedTime: "20 min"
        },
        "digital-footprints": {
          title: "Digital Footprint Tracker",
          description: "Understand what traces you leave online and how to manage them like a pro!",
          icon: "👣",
          level: "Intermediate",
          estimatedTime: "25 min"
        },
        "social-media-safety": {
          title: "Safe Social Media",
          description: "Navigate social platforms safely and responsibly while having fun with friends!",
          icon: "📱",
          level: "Intermediate",
          estimatedTime: "30 min"
        },
        "cyber-bullying": {
          title: "Cyber Bullying Defense",
          description: "Learn to identify, prevent, and respond to online bullying like a true cyber warrior!",
          icon: "🛡️",
          level: "Intermediate",
          estimatedTime: "25 min"
        },
        "privacy-guardian": {
          title: "Privacy Guardian",
          description: "Master the art of protecting your personal information and privacy online!",
          icon: "🔒",
          level: "Advanced",
          estimatedTime: "35 min"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!progress || progress.total_courses === 0) return 0;
    return Math.round((progress.completed_courses / progress.total_courses) * 100);
  };

  const getCourseStatus = (courseId: string) => {
    if (!progress?.progress[courseId]) return 'not-started';
    const courseProgress = progress.progress[courseId];
    return courseProgress.completed ? 'completed' : 'in-progress';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading your cyber adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Welcome back, {userName}! 🚀
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Ready to continue your epic cybersecurity adventure? Choose your next mission and become the ultimate cyber hero! 🛡️✨
          </p>

          {/* Progress Overview */}
          {progress && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 md:p-8 text-white shadow-lg max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">🎯 Your Progress</h2>
                  <p className="text-blue-100 text-base md:text-lg">
                    {progress.completed_courses} of {progress.total_courses} courses mastered!
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{getProgressPercentage()}%</div>
                  <div className="text-blue-100">Complete</div>
                </div>
              </div>

              <div className="w-full bg-white bg-opacity-20 rounded-full h-3 md:h-4 mb-6">
                <div
                  className="bg-yellow-400 h-3 md:h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>

              {progress.eligible_for_certificate && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 md:p-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl mb-2">🎉</div>
                    <p className="text-lg md:text-xl font-bold mb-4">Certificate Ready!</p>
                    <button
                      onClick={() => userAPI.issueCertificate(parseInt(userId!))}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold transition-colors"
                    >
                      🏆 Claim Your Certificate!
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Achievement Badges */}
        {progress && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              🏆 Your Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-500 rounded-lg p-4 text-center text-white shadow-md">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-xl font-bold">{progress.completed_courses}</div>
                <div className="text-sm opacity-90">Completed</div>
              </div>

              <div className="bg-green-500 rounded-lg p-4 text-center text-white shadow-md">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-xl font-bold">{Math.round(progress.average_score)}%</div>
                <div className="text-sm opacity-90">Avg Score</div>
              </div>

              <div className="bg-purple-500 rounded-lg p-4 text-center text-white shadow-md">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-xl font-bold">{Object.keys(progress.progress).length}</div>
                <div className="text-sm opacity-90">Started</div>
              </div>

              <div className="bg-indigo-500 rounded-lg p-4 text-center text-white shadow-md">
                <div className="text-3xl mb-2">🏅</div>
                <div className="text-xl font-bold">{getProgressPercentage()}%</div>
                <div className="text-sm opacity-90">Progress</div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            🎮 Choose Your Adventure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(courses).map(([courseId, course]) => {
              const status = getCourseStatus(courseId);
              const courseProgress = progress?.progress[courseId];

              const cardColors: Record<string, string> = {
                'password-basics': 'bg-blue-500',
                'phishing-awareness': 'bg-purple-500',
                'digital-footprints': 'bg-green-500',
                'social-media-safety': 'bg-orange-500',
                'cyber-bullying': 'bg-indigo-500',
                'privacy-guardian': 'bg-gray-500'
              };

              return (
                <Link
                  key={courseId}
                  to={`/course/${courseId}`}
                  className={`block ${cardColors[courseId] || 'bg-blue-500'} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{course.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      status === 'completed' ? 'bg-green-600' :
                      status === 'in-progress' ? 'bg-yellow-600' :
                      'bg-white bg-opacity-20'
                    }`}>
                      {status === 'completed' ? '✅ Done' :
                      status === 'in-progress' ? '🔄 Active' : '🚀 Start'}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3">
                    {course.title}
                  </h3>

                  <p className="text-white text-opacity-90 mb-4 text-sm">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                      ⏱️ {course.estimatedTime}
                    </span>
                  </div>

                  {courseProgress && courseProgress.best_quiz_score > 0 && (
                    <div className="mt-3 text-center">
                      <span className="text-sm font-bold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        🌟 Best: {Math.round(courseProgress.best_quiz_score)}%
                      </span>
                    </div>
                  )}

                  {status === 'in-progress' && courseProgress && (
                    <div className="mt-3">
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(courseProgress.quiz_attempts * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        {progress && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {progress.completed_courses}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Courses Completed</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {Math.round(progress.average_score)}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Average Score</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {progress.certificate ? '🏆' : progress.eligible_for_certificate ? '🎯' : '📚'}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {progress.certificate ? 'Certified!' :
                 progress.eligible_for_certificate ? 'Ready to Graduate' : 'Learning'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
