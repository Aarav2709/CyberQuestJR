import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI, courseAPI } from '../services/api';
import { UserProgress, Course } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('cyberquest_user_id');
  const userName = localStorage.getItem('cyberquest_user_name') || 'Student';

  useEffect(() => {
    if (!userId) {
      navigate('/profile');
      return;
    }

    const fetchData = async () => {
      try {
        const [progressData, coursesData] = await Promise.all([
          userAPI.getUserProgress(parseInt(userId)),
          courseAPI.getCourses()
        ]);

        setProgress(progressData);
        setCourses(coursesData.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.completed_courses / progress.total_courses) * 100);
  };

  const getCourseStatus = (courseId: string) => {
    if (!progress?.progress[courseId]) return 'not-started';
    return progress.progress[courseId].completed ? 'completed' : 'in-progress';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {userName}! 🎓
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Continue your cybersecurity learning journey
          </p>

          {/* Progress Overview */}
          {progress && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Overall Progress
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {progress.completed_courses} of {progress.total_courses} courses completed
              </p>

              {progress.eligible_for_certificate && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 font-semibold">
                    🎉 Ready for your certificate!
                  </p>
                  <button
                    onClick={() => userAPI.issueCertificate(parseInt(userId!))}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Get Certificate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(courses).map(([courseId, course]) => {
            const status = getCourseStatus(courseId);
            const courseProgress = progress?.progress[courseId];

            return (
              <Link
                key={courseId}
                to={`/course/${courseId}`}
                className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{course.icon}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {status === 'completed' ? 'Completed' :
                     status === 'in-progress' ? 'In Progress' : 'Start'}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.level === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {course.level}
                  </span>

                  {courseProgress && courseProgress.best_quiz_score > 0 && (
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Best: {Math.round(courseProgress.best_quiz_score)}%
                    </span>
                  )}
                </div>

                {status === 'in-progress' && courseProgress && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(courseProgress.quiz_attempts * 20, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
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
