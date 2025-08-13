import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, exerciseAPI, api } from '../services/api';
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

  const userId = localStorage.getItem('cyberquest_user_id') || '1'; // Default user ID

  useEffect(() => {
    if (!courseId) {
      navigate('/dashboard');
      return;
    }

    const loadCourse = async () => {
      try {
        setLoading(true);

        // Always ensure we have a user
        let currentUserId: string | null = localStorage.getItem('cyberquest_user_id');

        if (!currentUserId) {
          // Create a default user automatically - keep trying until it works
          let userCreated = false;
          let attempts = 0;

          while (!userCreated && attempts < 3) {
            try {
              const defaultUser = {
                name: `Student${attempts > 0 ? attempts + 1 : ''}`,
                age: 12,
                experience_level: 'beginner',
                interests: ['cybersecurity', 'learning']
              };

              console.log(`🔄 Attempting to create user (attempt ${attempts + 1})...`);
              const userResponse = await api.post('/api/users', defaultUser);
              currentUserId = userResponse.data.id.toString();
              localStorage.setItem('cyberquest_user_id', currentUserId as string);
              localStorage.setItem('cyberquest_user_name', userResponse.data.name);
              console.log('✅ Created new user:', userResponse.data);
              userCreated = true;
            } catch (userError) {
              console.error(`❌ Failed to create user (attempt ${attempts + 1}):`, userError);
              attempts++;

              if (attempts >= 3) {
                // Last resort: throw error so user knows something is wrong
                throw new Error('Unable to create user account. Please check if the backend server is running.');
              }

              // Wait a bit before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

        console.log('🔄 Loading course with ID:', courseId, 'for user:', currentUserId);

        // Validate that the user exists before generating content
        try {
          await api.get(`/api/users/${currentUserId!}`);
          console.log('✅ User validated:', currentUserId);
        } catch (userValidationError) {
          console.error('❌ User validation failed, creating new user:', userValidationError);
          // User doesn't exist, clear localStorage and create new user
          localStorage.removeItem('cyberquest_user_id');
          localStorage.removeItem('cyberquest_user_name');

          // Create new user
          const defaultUser = {
            name: 'Student',
            age: 12,
            experience_level: 'beginner',
            interests: ['cybersecurity', 'learning']
          };

          const userResponse = await api.post('/api/users', defaultUser);
          currentUserId = userResponse.data.id.toString();
          localStorage.setItem('cyberquest_user_id', currentUserId as string);
          localStorage.setItem('cyberquest_user_name', userResponse.data.name);
          console.log('✅ Created replacement user:', userResponse.data);
        }

        // Generate course content
        const content = await courseAPI.generateCourseContent(parseInt(currentUserId!), courseId as string);
        console.log('✅ Course content received:', content);
        setCourseContent(content);

      } catch (error) {
        console.error('❌ Failed to load course:', error);
        // Don't show fallback content, just let it show "course not found"
      } finally {
        setLoading(false);
      }
    };    loadCourse();
  }, [userId, courseId, navigate]);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = async () => {
    if (!courseId) return;

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 via-blue-100 via-pink-100 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 font-semibold"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
            {courseId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Course
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {['content', 'exercises', 'quiz'].map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentSection === section
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {currentSection === 'content' && courseContent && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">📚 Course Content</h2>
            <div className="text-gray-800 leading-relaxed text-lg space-y-4">
              <div className="whitespace-pre-line">
                {courseContent.content}
              </div>
            </div>
          </div>
        )}

        {/* Exercises Section */}
        {currentSection === 'exercises' && courseContent && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🏋️ Practice Exercises</h2>
            {courseContent.exercises && courseContent.exercises.map((exercise, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg border-4 border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🎯 {exercise.title}
                </h3>
                <p className="text-gray-700 mb-4 text-lg">{exercise.description}</p>
                <p className="text-gray-600 mb-4 bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-400">
                  💡 <strong>Instructions:</strong> {exercise.instructions}
                </p>

                <div className="space-y-4">
                  {exercise.type === 'password' && (
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        🔐 Create a strong password:
                      </label>
                      <input
                        type="password"
                        value={exerciseAnswers[index] || ''}
                        onChange={(e) => handleExerciseAnswer(index, e.target.value)}
                        className="w-full p-3 border-2 border-blue-300 rounded-lg bg-white text-gray-900 text-lg"
                        placeholder="Enter your password..."
                      />
                    </div>
                  )}

                  {exercise.type === 'email' && (
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        📧 Evaluate this email address:
                      </label>
                      <input
                        type="email"
                        value={exerciseAnswers[index] || ''}
                        onChange={(e) => handleExerciseAnswer(index, e.target.value)}
                        className="w-full p-3 border-2 border-blue-300 rounded-lg bg-white text-gray-900 text-lg"
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
