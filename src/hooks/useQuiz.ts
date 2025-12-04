import { useCallback } from 'react';
import api, { type QuizAttempt, type QuizAnalytics } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useQuiz() {
  const { isAuthenticated, refreshGamification } = useAuth();

  const submitQuiz = useCallback(async (
    lessonId: string,
    score: number,
    totalQuestions: number,
    answers: Record<string, string>
  ): Promise<{ success: boolean; attempt?: QuizAttempt; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await api.submitQuiz({
      lessonId,
      score,
      totalQuestions,
      answers,
    });

    if (error) {
      return { success: false, error };
    }

    // Refresh gamification data after quiz submission (XP may have changed)
    await refreshGamification();

    return { success: true, attempt: data || undefined };
  }, [isAuthenticated, refreshGamification]);

  const getQuizHistory = useCallback(async (lessonId?: string): Promise<QuizAttempt[]> => {
    if (!isAuthenticated) return [];

    const { data } = await api.getQuizHistory(lessonId);
    return data || [];
  }, [isAuthenticated]);

  const getQuizAnalytics = useCallback(async (): Promise<QuizAnalytics | null> => {
    if (!isAuthenticated) return null;

    const { data } = await api.getQuizAnalytics();
    return data || null;
  }, [isAuthenticated]);

  return {
    submitQuiz,
    getQuizHistory,
    getQuizAnalytics,
  };
}
