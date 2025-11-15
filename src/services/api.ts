import axios from 'axios';

const normalizeUrl = (value?: string) => {
  if (!value) return undefined;
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const getDefaultBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:8000';
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
};

const API_BASE_URL = normalizeUrl(import.meta.env.VITE_API_BASE_URL) ?? getDefaultBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const quizAPI = {
  generateQuiz: async (quizType: string) => {
    const response = await api.get(`/api/quiz/generate/${quizType}`);
    return response.data;
  },

  submitQuiz: async (submission: any) => {
    const response = await api.post('/api/quiz/submit', submission);
    return response.data;
  },
};

export const moduleAPI = {
  list: async () => {
    const response = await api.get('/api/modules');
    return response.data;
  },
  getDetails: async (moduleName: string) => {
    const response = await api.get(`/api/modules/${moduleName}`);
    return response.data;
  },
  getChallenge: async (moduleName: string, level: string = 'beginner') => {
    const response = await api.get(`/api/modules/${moduleName}/challenge`, {
      params: { level },
    });
    return response.data;
  },
};

export const leaderboardAPI = {
  getLeaderboard: async () => {
    const response = await api.get('/api/leaderboard');
    return response.data;
  },
};

export const progressAPI = {
  getProgress: async () => {
    const response = await api.get('/api/progress');
    return response.data;
  },
};

export const aiAPI = {
  generateChallenge: async (payload: { challenge_type: string; difficulty?: string; topic?: string }) => {
    const response = await api.post('/api/ai/challenges/generate', payload);
    return response.data;
  },
  submitAnswer: async (payload: { challenge_id: string; answer: string; correct_answer: string }) => {
    const response = await api.post('/api/ai/challenges/answer', payload);
    return response.data;
  },
};
