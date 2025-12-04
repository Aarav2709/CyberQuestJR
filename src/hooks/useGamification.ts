import { useState, useCallback } from 'react';
import api, { type LeaderboardEntry, type Certificate, type CertificateVerification } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time') => {
    setIsLoading(true);
    const { data } = await api.getLeaderboard(timeframe);
    if (data) setLeaderboard(data);
    setIsLoading(false);
  }, []);

  return {
    leaderboard,
    isLoading,
    fetchLeaderboard,
  };
}

export function useCertificates() {
  const { isAuthenticated, refreshGamification } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCertificates = useCallback(async () => {
    if (!isAuthenticated) {
      setCertificates([]);
      return;
    }

    setIsLoading(true);
    const { data } = await api.getCertificates();
    if (data) setCertificates(data);
    setIsLoading(false);
  }, [isAuthenticated]);

  const generateCertificate = useCallback(async (chapterId?: string): Promise<Certificate | null> => {
    if (!isAuthenticated) return null;

    const { data, error } = await api.generateCertificate(chapterId);

    if (error || !data) return null;

    // Refresh certificates and gamification (badge may have been earned)
    await Promise.all([fetchCertificates(), refreshGamification()]);

    return data;
  }, [isAuthenticated, fetchCertificates, refreshGamification]);

  const verifyCertificate = useCallback(async (code: string): Promise<CertificateVerification | null> => {
    const { data } = await api.verifyCertificate(code);
    return data || null;
  }, []);

  return {
    certificates,
    isLoading,
    fetchCertificates,
    generateCertificate,
    verifyCertificate,
  };
}

export function useStreak() {
  const { isAuthenticated, gamification, refreshGamification } = useAuth();

  const recordActivity = useCallback(async () => {
    if (!isAuthenticated) return;
    await api.recordActivity();
    await refreshGamification();
  }, [isAuthenticated, refreshGamification]);

  return {
    currentStreak: gamification?.streak.currentStreak || 0,
    longestStreak: gamification?.streak.longestStreak || 0,
    lastActivityDate: gamification?.streak.lastActivityDate || null,
    recordActivity,
  };
}

// Utility hook to get level info
export function useLevelInfo() {
  const { gamification } = useAuth();

  if (!gamification) {
    return {
      level: 1,
      totalXp: 0,
      xpToNextLevel: 100,
      levelProgress: 0,
    };
  }

  return {
    level: gamification.profile.currentLevel,
    totalXp: gamification.profile.totalXp,
    xpToNextLevel: gamification.profile.xpToNextLevel,
    levelProgress: gamification.profile.levelProgress,
  };
}

// Utility hook to get badges
export function useBadges() {
  const { gamification } = useAuth();
  return gamification?.badges || [];
}
