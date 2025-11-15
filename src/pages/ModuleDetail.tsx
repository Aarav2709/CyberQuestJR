import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AIGame from '../components/AIGame';
import { aiAPI, moduleAPI } from '../services/api';
import { Sparkles, RefreshCcw, Shield, Lock, Search, Globe, Smartphone, Gamepad2, AlertTriangle } from 'lucide-react';
import type { AIMetadata } from '../types';

interface GameSession {
  session_id: string;
  current_challenge: number;
  score: number;
  lives: number;
  power_ups: any;
  is_active: boolean;
}

interface Player {
  id: number;
  username: string;
  level: number;
  experience_points: number;
  coins: number;
  avatar: string;
}

interface LearningSection {
  title: string;
  content: string;
}

interface ModuleDetails {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  duration: string;
  learning_content?: {
    sections?: LearningSection[];
    interactive_demo?: boolean;
    mini_games?: string[];
  };
}

const ModuleDetail: React.FC = () => {
  const { moduleName } = useParams<{ moduleName: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameSession] = useState<GameSession | null>(null);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  // Optional: track latest score if you surface it in UI
  // const [currentScore, setCurrentScore] = useState(0);
  const [difficulty, setDifficulty] = useState('beginner');
  const [moduleDetails, setModuleDetails] = useState<ModuleDetails | null>(null);
  const [moduleLoading, setModuleLoading] = useState(true);
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [challengePreview, setChallengePreview] = useState<any | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [previewMetadata, setPreviewMetadata] = useState<AIMetadata | null>(null);

  // Initialize player (in a real app, this would come from authentication)
  useEffect(() => {
    initializePlayer();
  }, []);

  const initializePlayer = async () => {
    try {
      // For demo purposes, create a demo player
      const demoPlayer = {
        id: 1,
        username: "CyberHero",
        level: 1,
        experience_points: 0,
        coins: 100,
        avatar: "Guide"
      };
      setPlayer(demoPlayer);
      setPlayerLoading(false);
    } catch (error) {
      console.error('Error initializing player:', error);
      setPlayerLoading(false);
    }
  };

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!moduleName) return;
      try {
        setModuleLoading(true);
        setModuleError(null);
        const data = await moduleAPI.getDetails(moduleName);
        setModuleDetails(data);
      } catch (error: any) {
        console.error('Error fetching module', error);
        setModuleError('Unable to load module content right now.');
      } finally {
        setModuleLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleName]);

  const startGame = async () => {
    if (!player || !moduleName) return;
    setGameStarted(true);
  };

  const getChallengeConfig = () => {
    let challengeType: string = 'phishing';
    let topic: string = 'general';
    switch (moduleName) {
      case 'password-basics':
        challengeType = 'password';
        topic = 'password_strength';
        break;
      case 'phishing-awareness':
        challengeType = 'phishing';
        topic = 'email_phishing';
        break;
      case 'privacy-guardian':
        challengeType = 'privacy';
        topic = 'privacy_protection';
        break;
      case 'digital-footprints':
        challengeType = 'privacy';
        topic = 'digital_footprint';
        break;
      case 'social-media-safety':
        challengeType = 'privacy';
        topic = 'social_media';
        break;
      case 'cyber-bullying':
        challengeType = 'privacy';
        topic = 'cyberbullying';
        break;
      default:
        challengeType = 'phishing';
        topic = 'general';
    }

    return { challengeType, topic };
  };

  const previewChallenge = async () => {
    if (!moduleName) return;
    try {
      setChallengeLoading(true);
      setChallengeError(null);
      const { challengeType, topic } = getChallengeConfig();
      const { challenge } = await aiAPI.generateChallenge({
        challenge_type: challengeType,
        difficulty,
        topic,
      });
      setChallengePreview(challenge);
      setPreviewMetadata(challenge?.metadata ?? null);
    } catch (error: any) {
      console.error('Error generating challenge preview', error);
      const apiMessage = error?.response?.data?.detail || 'AI challenge generator is unavailable. Set GEMINI_API_KEY to enable live challenges.';
      setChallengeError(apiMessage);
      setChallengePreview(null);
      setPreviewMetadata(null);
    } finally {
      setChallengeLoading(false);
    }
  };

  // Score and player progression can be handled here when needed

  const renderGameComponent = () => {
    if (!gameStarted) return null;
    // Map module to AI challenge type/topic
    const { challengeType, topic } = getChallengeConfig();
    return <AIGame challengeType={challengeType as any} difficulty={difficulty as any} topic={topic} />;
  };

  const renderModuleIcon = () => {
    const key = moduleDetails?.id || moduleName || '';
    switch (key) {
      case 'password-basics':
        return <Lock className="h-12 w-12 text-purple-600" />;
      case 'phishing-awareness':
        return <Search className="h-12 w-12 text-purple-600" />;
      case 'digital-footprints':
        return <Globe className="h-12 w-12 text-purple-600" />;
      case 'social-media-safety':
        return <Smartphone className="h-12 w-12 text-purple-600" />;
      case 'cyber-bullying':
        return <Shield className="h-12 w-12 text-purple-600" />;
      case 'privacy-guardian':
        return <Lock className="h-12 w-12 text-purple-600" />;
      default:
        return <Gamepad2 className="h-12 w-12 text-purple-600" />;
    }
  };

  const getModuleInfo = () => {
    const moduleInfo: { [key: string]: { title: string; icon: string; description: string } } = {
      'password-basics': {
        title: 'Password Heroes',
        icon: 'Password',
        description: 'Become a password superhero and learn to create unbreakable passwords!'
      },
      'phishing-awareness': {
        title: 'Phishing Detective',
        icon: 'Detective',
        description: 'Develop your detective skills to spot and avoid phishing attempts!'
      },
      'social-media-safety': {
        title: 'Safe Social Media',
        icon: 'Social',
        description: 'Master the art of safe social media usage and privacy protection!'
      },
      'digital-footprints': {
        title: 'Digital Footprints',
        icon: 'Footprints',
        description: 'Learn to manage and protect your digital footprint online!'
      },
      'cyber-bullying': {
        title: 'Cyber Bullying Defense',
        icon: 'Defense',
        description: 'Build resilience and learn strategies to handle cyberbullying!'
      },
      'privacy-guardian': {
        title: 'Privacy Guardian',
        icon: 'Privacy',
        description: 'Become a guardian of privacy and protect personal information!'
      }
    };

    return moduleInfo[moduleName || ''] || {
      title: 'Cybersecurity Module',
      icon: 'Module',
      description: 'Learn important cybersecurity concepts through interactive gaming!'
    };
  };

  if (playerLoading || moduleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const moduleInfo = moduleDetails || getModuleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="mr-3">{renderModuleIcon()}</span>
                {moduleInfo.title}
              </h1>
              <p className="text-gray-600 mb-4">{moduleInfo.description}</p>
              {moduleError && (
                <div className="text-sm text-red-600 flex items-center space-x-1">
                  <RefreshCcw className="h-4 w-4" />
                  <span>{moduleError}</span>
                </div>
              )}
            </div>

            {player && (
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl">{player.avatar}</div>
                    <div className="text-sm font-medium">{player.username}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">Level {player.level}</div>
                    <div className="text-sm text-gray-500">{player.experience_points} XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{player.coins}</div>
                    <div className="text-sm text-gray-500">Coins</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Session Info */}
        {gameSession && (
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{gameSession.score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{gameSession.lives}</div>
                  <div className="text-sm text-gray-500">Lives</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">#{gameSession.current_challenge}</div>
                  <div className="text-sm text-gray-500">Challenge</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Content */}
        {moduleDetails?.learning_content?.sections && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <span>What You'll Master</span>
            </h2>
            <div className="grid gap-4">
              {moduleDetails.learning_content.sections.map((section, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
            {moduleDetails.learning_content.mini_games && (
              <div className="mt-6">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Mini Games</p>
                <div className="flex flex-wrap gap-2">
                  {moduleDetails.learning_content.mini_games.map((game) => (
                    <span key={game} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">{game}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {gameStarted ? (
          <div>
            {renderGameComponent()}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card text-center">
              <div className="mb-4 flex justify-center">{renderModuleIcon()}</div>
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Adventure?</h2>
              <p className="text-gray-600 mb-6">
                Experience interactive cybersecurity gaming with amazing visuals,
                challenges, and real-time feedback designed for young learners!
              </p>

              {/* Difficulty Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Difficulty:
                </label>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setDifficulty('beginner')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      difficulty === 'beginner'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Beginner
                  </button>
                  <button
                    onClick={() => setDifficulty('intermediate')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      difficulty === 'intermediate'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Intermediate
                  </button>
                  <button
                    onClick={() => setDifficulty('advanced')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      difficulty === 'advanced'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Advanced
                  </button>
                </div>
              </div>

              <button
                onClick={startGame}
                disabled={playerLoading}
                className="btn-primary text-lg px-8 py-3"
              >
                {playerLoading ? 'Starting...' : 'Start Interactive Game'}
              </button>
            </div>

            {/* Add a completion panel here if you decide to track score */}
          </div>
        )}

        <div className="card mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold">AI Challenge Preview</h3>
              <p className="text-gray-500 text-sm">See a sneak peek of the AI-powered challenge for this module.</p>
            </div>
            <button
              onClick={previewChallenge}
              disabled={challengeLoading}
              className="btn-secondary px-4 py-2 text-sm"
            >
              {challengeLoading ? 'Generating...' : 'Generate Preview'}
            </button>
          </div>
          {challengeError && <p className="text-sm text-red-600 mb-3">{challengeError}</p>}
          {previewMetadata && (
            <div
              className={`mb-3 rounded-xl border p-4 text-sm ${
                previewMetadata.ai_enabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center space-x-2 font-semibold">
                {previewMetadata.ai_enabled ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span>
                  {previewMetadata.ai_enabled ? 'Live AI mission generated' : 'Offline practice mission loaded'}
                </span>
              </div>
              {(previewMetadata.reason || previewMetadata.source) && (
                <p className="mt-2 text-xs">
                  {previewMetadata.reason || `Source: ${previewMetadata.source}`}
                </p>
              )}
              {previewMetadata.generated_at && (
                <p className="mt-1 text-[11px] text-gray-600">
                  Generated {new Date(previewMetadata.generated_at).toLocaleString()}
                </p>
              )}
            </div>
          )}
          {challengePreview ? (
            <pre className="bg-gray-900 text-green-200 p-4 rounded-xl overflow-auto text-sm max-h-96 whitespace-pre-wrap">
              {JSON.stringify(challengePreview, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-600 text-sm">Preview an AI challenge to understand the mission before you dive in.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
