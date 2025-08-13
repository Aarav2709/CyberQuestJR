import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { Course } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('cyberquest_user_name') || 'Student';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseAPI.getCourses();
        setCourses(coursesData.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-8 border-pink-300 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-purple-700">Loading your adventure! 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 via-blue-100 to-cyan-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Welcome, {userName}!
          </h1>
          <p className="text-2xl font-semibold text-purple-700 mb-8">
            Ready for an awesome cybersecurity adventure? 🚀
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(courses).map(([courseId, course], index) => {
            const colorClasses = [
              'from-pink-400 to-rose-500',
              'from-purple-400 to-indigo-500',
              'from-blue-400 to-cyan-500',
              'from-green-400 to-emerald-500',
              'from-yellow-400 to-orange-500',
              'from-red-400 to-pink-500'
            ];
            const bgColors = [
              'bg-gradient-to-br from-pink-50 to-rose-100',
              'bg-gradient-to-br from-purple-50 to-indigo-100',
              'bg-gradient-to-br from-blue-50 to-cyan-100',
              'bg-gradient-to-br from-green-50 to-emerald-100',
              'bg-gradient-to-br from-yellow-50 to-orange-100',
              'bg-gradient-to-br from-red-50 to-pink-100'
            ];

            const colorClass = colorClasses[index % colorClasses.length];
            const bgClass = bgColors[index % bgColors.length];

            return (
              <Link
                key={courseId}
                to={`/course/${courseId}`}
                className={`group block ${bgClass} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 border-4 border-white`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 transition-all duration-300">
                    {course.icon}
                  </div>

                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${colorClass} text-white font-bold text-lg mb-4 shadow-lg`}>
                    {course.title}
                  </div>

                  <p className="text-gray-700 font-medium mb-4 text-sm leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      course.level === 'Beginner' ? 'bg-green-200 text-green-800 border-2 border-green-300' :
                      course.level === 'Intermediate' ? 'bg-yellow-200 text-yellow-800 border-2 border-yellow-300' :
                      'bg-red-200 text-red-800 border-2 border-red-300'
                    }`}>
                      {course.level} ⭐
                    </span>
                    {course.estimatedTime && (
                      <span className="text-xs text-purple-700 font-semibold bg-purple-100 px-2 py-1 rounded-full">
                        ⏱️ {course.estimatedTime}
                      </span>
                    )}
                  </div>

                  <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r ${colorClass} text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <span>Start Adventure</span>
                    <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Fun bottom section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl p-8 shadow-2xl border-4 border-white">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to become a Cyber Hero? 🦸‍♂️</h3>
            <p className="text-white text-lg opacity-90">Click on any course above to start your learning journey!</p>
            <div className="flex justify-center space-x-4 mt-6 text-4xl">
              <span>🌟</span>
              <span>🎯</span>
              <span>🏆</span>
              <span>🚀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
