import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AIGame from '../components/AIGame';

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

const ModuleDetail: React.FC = () => {
  const { moduleName } = useParams<{ moduleName: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  // Optional: track latest score if you surface it in UI
  // const [currentScore, setCurrentScore] = useState(0);
  const [difficulty, setDifficulty] = useState('beginner');

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
        avatar: "🦸"
      };
      setPlayer(demoPlayer);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing player:', error);
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!player || !moduleName) return;
    setGameStarted(true);
  };

  // Score and player progression can be handled here when needed

  const renderGameComponent = () => {
    if (!gameStarted) return null;
    // Map module to AI challenge type/topic
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
    return <AIGame challengeType={challengeType as any} difficulty={difficulty as any} topic={topic} />;
  };

  const getModuleInfo = () => {
    const moduleInfo: { [key: string]: { title: string; icon: string; description: string } } = {
      'password-basics': {
        title: 'Password Heroes 🔐',
        icon: '🦸‍♂️',
        description: 'Become a password superhero and learn to create unbreakable passwords!'
      },
      'phishing-awareness': {
        title: 'Phishing Detective 🕵️',
        icon: '🔍',
        description: 'Develop your detective skills to spot and avoid phishing attempts!'
      },
      'social-media-safety': {
        title: 'Safe Social Media 📱',
        icon: '🛡️',
        description: 'Master the art of safe social media usage and privacy protection!'
      },
      'digital-footprints': {
        title: 'Digital Footprints 👣',
        icon: '🌐',
        description: 'Learn to manage and protect your digital footprint online!'
      },
      'cyber-bullying': {
        title: 'Cyber Bullying Defense 🛡️',
        icon: '⚔️',
        description: 'Build resilience and learn strategies to handle cyberbullying!'
      },
      'privacy-guardian': {
        title: 'Privacy Guardian 🛡️',
        icon: '🔒',
        description: 'Become a guardian of privacy and protect personal information!'
      }
    };

    return moduleInfo[moduleName || ''] || {
      title: 'Cybersecurity Module',
      icon: '🎮',
      description: 'Learn important cybersecurity concepts through interactive gaming!'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const moduleInfo = getModuleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-4xl mr-3">{moduleInfo.icon}</span>
                {moduleInfo.title}
              </h1>
              <p className="text-gray-600 mb-4">{moduleInfo.description}</p>
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
                    <div className="text-lg font-bold text-yellow-600">{player.coins} 🪙</div>
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
                  <div className="text-2xl">{'❤️'.repeat(gameSession.lives)}</div>
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
        {gameStarted ? (
          <div>
            {renderGameComponent()}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card text-center">
              <div className="text-6xl mb-4">{moduleInfo.icon}</div>
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
                    🌟 Beginner
                  </button>
                  <button
                    onClick={() => setDifficulty('intermediate')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      difficulty === 'intermediate'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ⚡ Intermediate
                  </button>
                  <button
                    onClick={() => setDifficulty('advanced')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      difficulty === 'advanced'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🚀 Advanced
                  </button>
                </div>
              </div>

              <button
                onClick={startGame}
                disabled={loading}
                className="btn-primary text-lg px-8 py-3"
              >
                {loading ? 'Starting...' : '🚀 Start Interactive Game'}
              </button>
            </div>

            {/* Add a completion panel here if you decide to track score */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
