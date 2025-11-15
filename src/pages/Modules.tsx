import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  RefreshCcw,
  Shield,
  Lock,
  Search,
  Globe,
  Smartphone,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { aiAPI, moduleAPI } from '../services/api';
import type { AIMetadata } from '../types';

interface SimpleModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon?: string;
}

const fallbackModules: SimpleModule[] = [
    {
      id: "password-basics",
      title: "Password Heroes",
      description: "Learn to create super-strong passwords that protect your digital world! Discover the secrets of unbreakable passwords.",
      duration: "15 mins",
  difficulty: "beginner"
    },
    {
      id: "phishing-awareness",
      title: "Phishing Detective",
      description: "Become a detective and spot fake emails and websites before they trick you! Train your eagle eye for suspicious content.",
      duration: "20 mins",
  difficulty: "beginner"
    },
    {
      id: "digital-footprints",
      title: "Digital Footprints",
      description: "Understand what traces you leave online and how to manage them safely! Learn about your digital identity.",
      duration: "25 mins",
  difficulty: "intermediate"
    },
    {
      id: "social-media-safety",
      title: "Safe Social Media",
      description: "Have fun on social media while keeping yourself and your friends safe! Master the art of safe sharing.",
      duration: "30 mins",
  difficulty: "intermediate"
    },
    {
      id: "cyber-bullying",
      title: "Cyber Bullying Defense",
      description: "Know how to handle and report cyberbullying incidents! Stand up against online bullies like a true hero.",
      duration: "20 mins",
  difficulty: "advanced"
    },
    {
      id: "privacy-guardian",
      title: "Privacy Guardian",
      description: "Protect your personal information like a professional guardian! Learn advanced privacy techniques.",
      duration: "35 mins",
  difficulty: "advanced"
    }
  ];

const Modules: React.FC = () => {
  const [modules, setModules] = useState<SimpleModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiStatusLoading, setAiStatusLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState<{ metadata?: AIMetadata | null; error?: string } | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moduleAPI.list();
      setModules(data);
    } catch (err) {
      console.error('Failed to load modules', err);
      setError('We could not reach the learning catalog. Showing an offline preview instead.');
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    const checkAiStatus = async () => {
      try {
        setAiStatusLoading(true);
        const data = await aiAPI.generateChallenge({
          challenge_type: 'phishing',
          difficulty: 'beginner',
          topic: 'status-check'
        });
        setAiStatus({ metadata: data?.challenge?.metadata ?? null });
      } catch (statusError) {
        console.error('Failed to check AI status', statusError);
        setAiStatus({ error: 'AI challenge engine is offline. Using offline missions instead.' });
      } finally {
        setAiStatusLoading(false);
      }
    };

    checkAiStatus();
  }, []);

  const visibleModules = modules.length ? modules : fallbackModules;

  const renderModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'password-basics':
        return <Lock className="h-10 w-10 text-white" />;
      case 'phishing-awareness':
        return <Search className="h-10 w-10 text-white" />;
      case 'digital-footprints':
        return <Globe className="h-10 w-10 text-white" />;
      case 'social-media-safety':
        return <Smartphone className="h-10 w-10 text-white" />;
      case 'cyber-bullying':
        return <Shield className="h-10 w-10 text-white" />;
      case 'privacy-guardian':
        return <Lock className="h-10 w-10 text-white" />;
      default:
        return <Star className="h-10 w-10 text-white" />;
    }
  };

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
            Learning Modules
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose your cybersecurity adventure. Each module teaches you important skills to stay safe online.
          </p>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 inline-block">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              Complete modules to earn points and climb the leaderboard.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className={`rounded-2xl p-4 flex items-center space-x-3 border ${
            aiStatus?.metadata?.ai_enabled
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-100'
              : 'bg-amber-50/70 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-100'
          }`}>
            {aiStatusLoading ? (
              <RefreshCcw className="h-5 w-5 animate-spin" />
            ) : aiStatus?.metadata?.ai_enabled ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <div>
              <p className="font-semibold">
                {aiStatusLoading
                  ? 'Checking AI challenge engine...'
                  : aiStatus?.metadata?.ai_enabled
                    ? 'Live AI-powered missions are online!'
                    : aiStatus?.error || aiStatus?.metadata?.reason || 'AI is in offline practice mode.'}
              </p>
              {!aiStatusLoading && aiStatus?.metadata?.generated_at && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Updated {new Date(aiStatus.metadata.generated_at).toLocaleString()} via {aiStatus.metadata.source}
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchModules}
              className="inline-flex items-center space-x-2 text-sm font-semibold hover:text-red-900"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {loading && !modules.length && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleModules.map((module) => (
            <div
              key={module.id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {renderModuleIcon(module.id)}
                  </div>
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
