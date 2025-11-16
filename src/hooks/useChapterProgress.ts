import { useCallback, useSyncExternalStore } from 'react';

export type ChapterStatus = 'fresh' | 'started' | 'complete';
export type ProgressMap = Record<string, ChapterStatus>;
export type LessonProgressMap = Record<string, Set<string>>; // chapterId -> Set of completed lessonIds

const STORAGE_KEY = 'cyberquestjr-chapter-progress';
const LESSON_STORAGE_KEY = 'cyberquestjr-lesson-progress';

export const STATUS_WEIGHT: Record<ChapterStatus, number> = {
  fresh: 0,
  started: 0.45,
  complete: 1,
};

export function chapterPercent(status: ChapterStatus): number {
  return Math.round((STATUS_WEIGHT[status] ?? 0) * 100);
}

export function calculateLessonProgress(completedLessons: number, totalLessons: number): number {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

function readStorage(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as ProgressMap;
    }
    return {};
  } catch {
    return {};
  }
}

function readLessonStorage(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(LESSON_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, string[]>;
    }
    return {};
  } catch {
    return {};
  }
}

function persistLessonStorage(data: Record<string, string[]>) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(data));
  }
}

let store: ProgressMap = readStorage();
let lessonStore: Record<string, string[]> = readLessonStorage();
const subscribers = new Set<() => void>();
let storageBound = false;

function persist(next: ProgressMap) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

function emit() {
  subscribers.forEach((listener) => listener());
}

function updateStore(updater: (prev: ProgressMap) => ProgressMap) {
  const next = updater(store);
  if (next === store) return;
  store = next;
  persist(store);
  emit();
}

function subscribe(listener: () => void) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

function getSnapshot() {
  return store;
}

function getServerSnapshot() {
  return store;
}

function getLessonSnapshot() {
  return lessonStore;
}

function bindStorageListener() {
  if (storageBound || typeof window === 'undefined') return;
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      try {
        const next = event.newValue ? (JSON.parse(event.newValue) as ProgressMap) : {};
        store = next;
        emit();
      } catch {
        // ignore malformed payloads
      }
    } else if (event.key === LESSON_STORAGE_KEY) {
      try {
        const next = event.newValue ? (JSON.parse(event.newValue) as Record<string, string[]>) : {};
        lessonStore = next;
        emit();
      } catch {
        // ignore malformed payloads
      }
    }
  });
  storageBound = true;
}

bindStorageListener();

export function useChapterProgress() {
  const subscribeStore = useCallback((listener: () => void) => subscribe(listener), []);
  const progress = useSyncExternalStore(subscribeStore, getSnapshot, getServerSnapshot);
  const lessonProgress = useSyncExternalStore(subscribeStore, getLessonSnapshot, getLessonSnapshot);

  const setStatus = useCallback((chapterId: string, status: ChapterStatus) => {
    updateStore((prev) => {
      if (prev[chapterId] === status) return prev;
      return { ...prev, [chapterId]: status };
    });
  }, []);

  const markStarted = useCallback((chapterId: string) => {
    updateStore((prev) => {
      const current = prev[chapterId];
      if (current === 'complete' || current === 'started') return prev;
      return { ...prev, [chapterId]: 'started' };
    });
  }, []);

  const markComplete = useCallback(
    (chapterId: string) => {
      setStatus(chapterId, 'complete');
    },
    [setStatus],
  );

  const markLessonComplete = useCallback((chapterId: string, lessonId: string) => {
    const current = lessonStore[chapterId] || [];
    if (!current.includes(lessonId)) {
      lessonStore = {
        ...lessonStore,
        [chapterId]: [...current, lessonId],
      };
      persistLessonStorage(lessonStore);
      emit();
    }
  }, []);

  const getCompletedLessons = useCallback((chapterId: string): string[] => {
    return lessonProgress[chapterId] || [];
  }, [lessonProgress]);

  return { progress, lessonProgress, markStarted, markComplete, setStatus, markLessonComplete, getCompletedLessons };
}
