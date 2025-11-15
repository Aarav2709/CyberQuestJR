import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Star, ArrowRight } from 'lucide-react';

interface SimpleModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: string;
}

const Modules: React.FC = () => {
  const modules: SimpleModule[] = [
    {
      id: "password-basics",
      title: "Password Heroes",
      description: "Learn to create super-strong passwords that protect your digital world! Discover the secrets of unbreakable passwords.",
      duration: "15 mins",
      difficulty: "beginner",
      icon: "🔐"
    },
    {
      id: "phishing-awareness",
      title: "Phishing Detective",
      description: "Become a detective and spot fake emails and websites before they trick you! Train your eagle eye for suspicious content.",
      duration: "20 mins",
      difficulty: "beginner",
      icon: "🕵️"
    },
    {
      id: "digital-footprints",
      title: "Digital Footprints",
      description: "Understand what traces you leave online and how to manage them safely! Learn about your digital identity.",
      duration: "25 mins",
      difficulty: "intermediate",
      icon: "👣"
    },
    {
      id: "social-media-safety",
      title: "Safe Social Media",
      description: "Have fun on social media while keeping yourself and your friends safe! Master the art of safe sharing.",
      duration: "30 mins",
      difficulty: "intermediate",
      icon: "📱"
    },
    {
      id: "cyber-bullying",
      title: "Cyber Bullying Defense",
      description: "Know how to handle and report cyberbullying incidents! Stand up against online bullies like a true hero.",
      duration: "20 mins",
      difficulty: "advanced",
      icon: "🛡️"
    },
    {
      id: "privacy-guardian",
      title: "Privacy Guardian",
      description: "Protect your personal information like a professional guardian! Learn advanced privacy techniques.",
      duration: "35 mins",
      difficulty: "advanced",
      icon: "🔒"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const starCount = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
    return Array.from({ length: starCount }, (_, i) => (
      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-800 dark:text-white mb-6">
            🎓 Learning Modules
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose your cybersecurity adventure! Each module teaches you important skills to stay safe online! 🚀
          </p>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 inline-block">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              🌟 Complete modules to earn points and climb the leaderboard! 🏆
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{module.icon}</div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{module.duration}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <div className="flex">{getDifficultyStars(module.difficulty)}</div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {module.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Interactive</span>
                  </div>
                </div>

                <Link
                  to={`/modules/${module.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 group"
                >
                  <span>Start Learning!</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modules;
