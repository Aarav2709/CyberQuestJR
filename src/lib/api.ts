const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {} } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Auth endpoints
  async register(data: { email: string; username: string; password: string; displayName?: string }) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: data,
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Profile endpoints
  async getProfile() {
    return this.request<Profile>('/profile');
  }

  async updateProfile(data: Partial<{ displayName: string; avatarUrl: string; settings: Record<string, unknown> }>) {
    return this.request<Profile>('/profile', {
      method: 'PATCH',
      body: data,
    });
  }

  // Progress endpoints
  async getProgress() {
    return this.request<ProgressData>('/progress');
  }

  async startChapter(chapterId: string) {
    return this.request<ChapterProgress>('/progress/chapter/start', {
      method: 'POST',
      body: { chapterId },
    });
  }

  async completeLesson(chapterId: string, lessonId: string) {
    return this.request<LessonProgress>('/progress/lesson/complete', {
      method: 'POST',
      body: { chapterId, lessonId },
    });
  }

  async getChapterProgress(chapterId: string) {
    return this.request<ChapterProgress>(`/progress/chapter/${chapterId}`);
  }

  // Quiz endpoints
  async submitQuiz(data: { lessonId: string; score: number; totalQuestions: number; answers: Record<string, string> }) {
    return this.request<QuizAttempt>('/quiz/submit', {
      method: 'POST',
      body: data,
    });
  }

  async getQuizHistory(lessonId?: string) {
    const endpoint = lessonId ? `/quiz/history?lessonId=${lessonId}` : '/quiz/history';
    return this.request<QuizAttempt[]>(endpoint);
  }

  async getQuizAnalytics() {
    return this.request<QuizAnalytics>('/quiz/analytics');
  }

  // Gamification endpoints
  async getGamification() {
    return this.request<GamificationData>('/gamification');
  }

  async getLeaderboard(timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time') {
    const endpoint = timeframe ? `/gamification/leaderboard?timeframe=${timeframe}` : '/gamification/leaderboard';
    return this.request<LeaderboardEntry[]>(endpoint);
  }

  async recordActivity() {
    return this.request<StreakData>('/gamification/activity', { method: 'POST' });
  }

  // Certificates endpoints
  async getCertificates() {
    return this.request<Certificate[]>('/certificates');
  }

  async generateCertificate(chapterId?: string) {
    return this.request<Certificate>('/certificates/generate', {
      method: 'POST',
      body: { chapterId },
    });
  }

  async verifyCertificate(code: string) {
    return this.request<CertificateVerification>(`/certificates/verify/${code}`);
  }
}

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  role: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalXp: number;
  currentLevel: number;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressData {
  chapters: ChapterProgress[];
  stats: {
    totalChapters: number;
    completedChapters: number;
    totalLessons: number;
    completedLessons: number;
    totalXpEarned: number;
  };
}

export interface ChapterProgress {
  id: string;
  chapterId: string;
  status: 'fresh' | 'started' | 'complete';
  startedAt: string | null;
  completedAt: string | null;
  lessons: LessonProgress[];
}

export interface LessonProgress {
  id: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  scrollPercent: number;
}

export interface QuizAttempt {
  id: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, string>;
  completedAt: string;
}

export interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  perfectScores: number;
  lessonBreakdown: Record<string, { attempts: number; avgScore: number }>;
}

export interface GamificationData {
  profile: {
    totalXp: number;
    currentLevel: number;
    xpToNextLevel: number;
    levelProgress: number;
  };
  streak: StreakData;
  badges: Badge[];
  recentXpEvents: XpEvent[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  category: string;
  earnedAt?: string;
}

export interface XpEvent {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  totalXp: number;
  currentLevel: number;
  avatarUrl: string | null;
}

export interface Certificate {
  id: string;
  type: string;
  chapterId: string | null;
  verificationCode: string;
  issuedAt: string;
  metadata: Record<string, unknown>;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: Certificate & {
    user: { displayName: string; username: string };
  };
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
export default api;
