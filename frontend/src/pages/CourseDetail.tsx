import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, exerciseAPI } from '../services/api';
import { CourseContent, QuizResult, ExerciseValidation } from '../types';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<'content' | 'exercises' | 'quiz'>('content');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [exerciseResults, setExerciseResults] = useState<Record<string, ExerciseValidation>>({});
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});

  const userId = localStorage.getItem('cyberquest_user_id');

  useEffect(() => {
    if (!userId || !courseId) {
      navigate('/dashboard');
      return;
    }

    const loadCourse = async () => {
      try {
        setLoading(true);
        const content = await courseAPI.generateCourseContent(parseInt(userId), courseId);
        setCourseContent(content);
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [userId, courseId, navigate]);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = async () => {
    if (!userId || !courseId) return;

    try {
      const result = await courseAPI.submitQuiz(parseInt(userId), courseId, quizAnswers);
      setQuizResult(result);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  const validateExercise = async (exerciseIndex: number, type: string) => {
    const answer = exerciseAnswers[exerciseIndex] || '';

    try {
      const result = await exerciseAPI.validateExercise(type, answer);
      setExerciseResults(prev => ({
        ...prev,
        [exerciseIndex]: result
      }));
    } catch (error) {
      console.error('Failed to validate exercise:', error);
    }
  };

  const handleExerciseAnswer = (exerciseIndex: number, answer: string) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answer
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!courseContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course: {courseId}</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {['content', 'exercises', 'quiz'].map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentSection === section
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {currentSection === 'content' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Content</h2>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: courseContent.content.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        )}

        {/* Exercises Section */}
        {currentSection === 'exercises' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Exercises</h2>
            {courseContent.exercises.map((exercise, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {exercise.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{exercise.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{exercise.instructions}</p>

                <div className="space-y-4">
                  {exercise.type === 'password' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Create a strong password:
                      </label>
                      <input
                        type="password"
                        value={exerciseAnswers[index] || ''}
                        onChange={(e) => handleExerciseAnswer(index, e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your password..."
                      />
                    </div>
                  )}

                  {exercise.type === 'email' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Evaluate this email address:
                      </label>
                      <input
                        type="email"
                        value={exerciseAnswers[index] || ''}
                        onChange={(e) => handleExerciseAnswer(index, e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter email to check..."
                      />
                    </div>
                  )}

                  {exercise.type === 'scenario' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your response:
                      </label>
                      <textarea
                        value={exerciseAnswers[index] || ''}
                        onChange={(e) => handleExerciseAnswer(index, e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Describe what you would do..."
                      />
                    </div>
                  )}

                  <button
                    onClick={() => validateExercise(index, exercise.type)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Check Answer
                  </button>

                  {exerciseResults[index] && (
                    <div className={`p-4 rounded-lg ${
                      exerciseResults[index].is_strong || exerciseResults[index].safety_score === 100 || exerciseResults[index].score
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      {exerciseResults[index].feedback && (
                        <p className="font-semibold mb-2">{exerciseResults[index].feedback}</p>
                      )}
                      {exerciseResults[index].strength && (
                        <p>Password Strength: {exerciseResults[index].strength}</p>
                      )}
                      {exerciseResults[index].warnings && exerciseResults[index].warnings!.length > 0 && (
                        <div>
                          <p className="font-semibold text-red-600">Warnings:</p>
                          <ul className="list-disc list-inside">
                            {exerciseResults[index].warnings!.map((warning, i) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {exerciseResults[index].tips && (
                        <div>
                          <p className="font-semibold">Tips:</p>
                          <ul className="list-disc list-inside">
                            {exerciseResults[index].tips!.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiz Section */}
        {currentSection === 'quiz' && !quizResult && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quiz</h2>
            <div className="space-y-6">
              {courseContent.quiz.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {questionIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={optionIndex}
                          checked={quizAnswers[questionIndex] === optionIndex}
                          onChange={() => handleQuizAnswer(questionIndex, optionIndex)}
                          className="mr-3 text-blue-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length !== courseContent.quiz.questions.length}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {currentSection === 'quiz' && quizResult && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Results</h2>
              <div className={`text-6xl font-bold mb-4 ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(quizResult.score)}%
              </div>
              <p className={`text-xl font-semibold ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                {quizResult.passed ? '🎉 Congratulations! You passed!' : '📚 Keep studying and try again!'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                You got {quizResult.correct_answers} out of {quizResult.total_questions} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Review:</h3>
              {quizResult.results.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  result.is_correct ? 'border-green-300 bg-green-50 dark:bg-green-900' : 'border-red-300 bg-red-50 dark:bg-red-900'
                }`}>
                  <p className="font-semibold mb-2">{index + 1}. {result.question}</p>
                  <p className={`${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {courseContent.quiz.questions[index].options[result.user_answer]}
                  </p>
                  {!result.is_correct && (
                    <p className="text-green-600">
                      Correct answer: {courseContent.quiz.questions[index].options[result.correct_answer]}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{result.explanation}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
