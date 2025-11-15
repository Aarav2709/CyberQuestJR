import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import { LeaderboardEntry } from '../types';
import { Trophy, Star, Medal, Crown } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardAPI.getLeaderboard();
      // Add missing properties to each entry
      const enrichedData = data.map((entry: any, index: number) => ({
        ...entry,
        badge: getBadge(index),
        username: entry.name || entry.anonymous_name || `Player${index + 1}`,
        level: getLevel(entry.score || entry.total_score || 0)
      }));
      setLeaderboard(enrichedData);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      // Set fallback data
      setLeaderboard([
        {
          rank: 1,
          name: 'CyberChampion',
          score: 950,
          quizzes_completed: 12,
          badge: 'Champion',
          username: 'CyberChampion',
          level: 'Expert'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (index: number): string => {
    switch (index) {
      case 0: return 'Champion';
      case 1: return 'Gold';
      case 2: return 'Silver';
      case 3: return 'Bronze';
      default: return 'Rising Star';
    }
  };

  const getLevel = (score: number): string => {
    if (score >= 900) return 'Expert';
    if (score >= 700) return 'Advanced';
    if (score >= 500) return 'Intermediate';
    return 'Beginner';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-white text-gray-700 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cyber Heroes Leaderboard
          </h1>
          <p className="text-xl text-gray-600">
            See how you rank against other cyber heroes! Keep learning to climb higher.
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="flex justify-center items-end mb-12 space-x-4">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg p-6 mb-4 transform translate-y-4">
                <Medal className="h-8 w-8 text-white mx-auto mb-2" />
                <div className="text-white font-bold">2nd</div>
              </div>
              <div className="card p-4">
                <div className="text-2xl font-semibold mb-2">{leaderboard[1]?.badge}</div>
                <div className="font-bold text-gray-900">{leaderboard[1].username}</div>
                <div className="text-sm text-gray-600">{leaderboard[1].score}%</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg p-8 mb-4">
                <Crown className="h-10 w-10 text-white mx-auto mb-2" />
                <div className="text-white font-bold text-lg">1st</div>
              </div>
              <div className="card p-6 transform scale-110">
                <div className="text-3xl font-semibold mb-2">{leaderboard[0]?.badge}</div>
                <div className="font-bold text-gray-900 text-lg">{leaderboard[0].username}</div>
                <div className="text-sm text-gray-600">{leaderboard[0].score}%</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg p-6 mb-4 transform translate-y-4">
                <Medal className="h-8 w-8 text-white mx-auto mb-2" />
                <div className="text-white font-bold">3rd</div>
              </div>
              <div className="card p-4">
                <div className="text-2xl font-semibold mb-2">{leaderboard[2]?.badge}</div>
                <div className="font-bold text-gray-900">{leaderboard[2].username}</div>
                <div className="text-sm text-gray-600">{leaderboard[2].score}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            All Cyber Heroes
          </h3>

          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${getRankColor(entry.rank)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(entry.rank)}
                  </div>

                  <div className="text-2xl">{entry.badge}</div>

                  <div>
                    <div className="font-medium">{entry.username}</div>
                    <div className="text-sm opacity-75">{entry.level}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">{entry.score}%</div>
                  <div className="text-sm opacity-75 capitalize">{entry.level}</div>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No heroes yet!
              </h3>
              <p className="text-gray-600">
                Be the first to take a quiz and appear on the leaderboard.
              </p>
            </div>
          )}
        </div>

        {/* Motivation Section */}
        <div className="card mt-8 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
          <div className="text-center">
            <Star className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Want to climb higher?
            </h3>
            <p className="text-gray-600 mb-4">
              Keep learning and taking quizzes to improve your rank!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/quiz"
                className="btn-primary"
              >
                Take a Quiz
              </a>
              <a
                href="/modules"
                className="btn-secondary"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
