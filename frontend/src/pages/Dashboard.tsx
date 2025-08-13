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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {userName}! 🎓
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Choose a cybersecurity course to begin learning
          </p>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">Available Courses</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {Object.entries(courses).map(([courseId, course]) => (
              <Link
                key={courseId}
                to={`/course/${courseId}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{course.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {course.description}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {course.level}
                        </span>
                        <span className="text-xs text-gray-500">
                          {course.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-600 font-medium">
                    Start →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
