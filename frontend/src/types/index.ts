// User Types
export interface User {
  id: number;
  name: string;
  age: number;
  experience_level: string;
  interests: string[];
}

export interface UserCreate {
  name: string;
  age: number;
  experience_level: string;
  interests: string[];
}

// Course Types
export interface Course {
  title: string;
  description: string;
  icon: string;
  level: string;
}

export interface CourseContent {
  content: string;
  exercises: Exercise[];
  quiz: Quiz;
}

export interface Exercise {
  title: string;
  description: string;
  type: 'password' | 'email' | 'scenario';
  instructions: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id?: number; // Optional for backwards compatibility
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

// Progress Types
export interface CourseProgress {
  completed: boolean;
  score: number;
  completion_date?: string;
  quiz_attempts: number;
  best_quiz_score: number;
}

export interface UserProgress {
  user_id: number;
  completed_courses: number;
  total_courses: number;
  average_score: number;
  progress: Record<string, CourseProgress>;
  eligible_for_certificate: boolean;
  certificate?: Certificate;
}

// Certificate Types
export interface Certificate {
  certificate_id: string;
  issued_date: string;
}

// Quiz Submission Types
export interface QuizSubmission {
  user_id: number;
  course_id: string;
  answers: Record<string, number>;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  correct_answers: number;
  total_questions: number;
  results: QuestionResult[];
  attempts: number;
}

export interface QuestionResult {
  question: string;
  user_answer: number;
  correct_answer: number;
  is_correct: boolean;
  explanation: string;
}

// Legacy Quiz Types (for backwards compatibility)
export interface QuizAnswer {
  question_id: string;
  answer: string;
}

// Exercise Validation Types
export interface ExerciseValidation {
  score?: number;
  feedback?: string;
  tips?: string[];
  strength?: string;
  warnings?: string[];
  is_strong?: boolean;
  safety_score?: number;
  is_suspicious?: boolean;
}

// Leaderboard Types
export interface LeaderboardEntry {
  name: string;
  completed_courses: number;
  average_score: number;
  total_score: number;
  has_certificate: boolean;
}
