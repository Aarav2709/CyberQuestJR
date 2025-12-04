import { useState, useCallback, useEffect } from 'react';
import api, { type ProgressData, type ChapterProgress, type LessonProgress } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useProgress() {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) {
      setProgress(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: apiError } = await api.getProgress();

    if (apiError) {
      setError(apiError);
    } else if (data) {
      setProgress(data);
    }

    setIsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const startChapter = useCallback(async (chapterId: string): Promise<ChapterProgress | null> => {
    if (!isAuthenticated) return null;

    const { data, error: apiError } = await api.startChapter(chapterId);

    if (apiError) {
      setError(apiError);
      return null;
    }

    // Refresh progress after starting chapter
    await fetchProgress();
    return data || null;
  }, [isAuthenticated, fetchProgress]);

  const completeLesson = useCallback(async (chapterId: string, lessonId: string): Promise<LessonProgress | null> => {
    if (!isAuthenticated) return null;

    const { data, error: apiError } = await api.completeLesson(chapterId, lessonId);

    if (apiError) {
      setError(apiError);
      return null;
    }

    // Refresh progress after completing lesson
    await fetchProgress();
    return data || null;
  }, [isAuthenticated, fetchProgress]);

  const getChapterStatus = useCallback((chapterId: string): 'fresh' | 'started' | 'complete' => {
    if (!progress) return 'fresh';
    const chapter = progress.chapters.find(c => c.chapterId === chapterId);
    return chapter?.status || 'fresh';
  }, [progress]);

  const getCompletedLessons = useCallback((chapterId: string): string[] => {
    if (!progress) return [];
    const chapter = progress.chapters.find(c => c.chapterId === chapterId);
    if (!chapter) return [];
    return chapter.lessons.filter(l => l.completed).map(l => l.lessonId);
  }, [progress]);

  const isLessonComplete = useCallback((chapterId: string, lessonId: string): boolean => {
    return getCompletedLessons(chapterId).includes(lessonId);
  }, [getCompletedLessons]);

  return {
    progress,
    isLoading,
    error,
    fetchProgress,
    startChapter,
    completeLesson,
    getChapterStatus,
    getCompletedLessons,
    isLessonComplete,
  };
}
