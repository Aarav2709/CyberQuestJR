export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizAnswer {
  question_id: string;
  answer: string;
}

export interface QuizSubmission {
  quiz_type: string;
  answers: QuizAnswer[];
  anonymous_name: string;
}

export interface QuizResult {
  score: number;
  level: string;
  feedback: {
    title: string;
    message: string;
    encouragement: string;
  };
}

export interface LearningModule {
  title: string;
  description: string;
  content: {
    sections: ModuleSection[];
  };
  name?: string;
  icon?: string;
  difficulty?: string;
  duration?: string;
}

export interface ModuleSection {
  title: string;
  content: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  quizzes_completed: number;
  badge?: string;
  username?: string;
  level?: string;
}

export interface Progress {
  available_modules: number;
  available_quizzes: number;
  message: string;
}

export interface AIMetadata {
  ai_enabled: boolean;
  source: string;
  reason?: string | null;
  generated_at?: string;
}
