import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// User API
export const userAPI = {
  createUser: async (userData: { name: string; age: number; experience_level: string; interests: string[] }) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  getUser: async (userId: number) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  getUserProgress: async (userId: number) => {
    const response = await api.get(`/api/users/${userId}/progress`);
    return response.data;
  },

  issueCertificate: async (userId: number) => {
    const response = await api.post(`/api/users/${userId}/certificate`);
    return response.data;
  },
};

// Course API
export const courseAPI = {
  getCourses: async () => {
    const response = await api.get('/api/courses');
    return response.data;
  },

  generateCourseContent: async (userId: number, courseId: string) => {
    const response = await api.post('/api/courses/generate', { user_id: userId, course_id: courseId });
    return response.data;
  },

  submitQuiz: async (userId: number, courseId: string, answers: Record<string, any>) => {
    const response = await api.post('/api/courses/submit-quiz', { user_id: userId, course_id: courseId, answers });
    return response.data;
  },
};

// Exercise API
export const exerciseAPI = {
  validateExercise: async (type: string, answer: string) => {
    const response = await api.post('/api/exercises/validate', { type, answer });
    return response.data;
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async () => {
    const response = await api.get('/api/leaderboard');
    return response.data;
  },
};

// Legacy Quiz API (for backwards compatibility)
export const quizAPI = {
  generateQuiz: async (_quizType: string) => {
    // For now, return mock data since the old quiz system is deprecated
    return {
      questions: [
        {
          id: 1,
          question: "What makes a strong password?",
          options: [
            "A) Your birthday and name",
            "B) A mix of letters, numbers, and symbols",
            "C) Your pet's name",
            "D) 'password123'"
          ],
          correct_answer: 1, // Use number instead of string
          explanation: "Strong passwords use different types of characters and are hard to guess!"
        },
        {
          id: 2,
          question: "What should you do if you get a suspicious email?",
          options: [
            "A) Click all the links to see what happens",
            "B) Delete it and tell an adult",
            "C) Reply with your personal information",
            "D) Forward it to all your friends"
          ],
          correct_answer: 1, // Use number instead of string
          explanation: "Always tell a trusted adult about suspicious emails and never click unknown links!"
        }
      ]
    };
  },

  submitQuiz: async (_submission: any) => {
    // Mock response for old quiz system
    return {
      score: 85,
      level: 'intermediate',
      feedback: {
        title: 'Great job!',
        message: 'You did well on this quiz.',
        encouragement: 'Keep learning!'
      }
    };
  },
};
