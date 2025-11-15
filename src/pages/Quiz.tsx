import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { QuizQuestion, QuizAnswer } from '../types';
import { Brain, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

const Quiz: React.FC = () => {
  const { type = 'general' } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [personalizedCourse, setPersonalizedCourse] = useState<any>(null);

  useEffect(() => {
    loadQuiz();
  }, [type]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const data = await quizAPI.generateQuiz(type);
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Failed to load quiz:', error);
      // Fallback questions in case API fails
      setQuestions([
        {
          id: 1,
          question: "What makes a strong password?",
          options: [
            "A) Your birthday and name",
            "B) A mix of letters, numbers, and symbols",
            "C) Your pet's name",
            "D) 'password123'"
          ],
          correct_answer: "B",
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
          correct_answer: "B",
          explanation: "Always tell a trusted adult about suspicious emails and never click unknown links!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionText: string) => {
    setSelectedOption(optionText);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentQuestionIndex];

    const newAnswer: QuizAnswer = {
      question_id: String(currentQuestion.id),
      answer: selectedOption
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: QuizAnswer[]) => {
    setSubmitting(true);
    try {
      const submission = {
        quiz_type: type,
        answers: finalAnswers,
        anonymous_name: "CyberHero" + Math.floor(Math.random() * 1000)
      };

      const result = await quizAPI.submitQuiz(submission);
      setQuizResult(result);

      // If this is an assessment quiz, generate personalized course
      if (type === 'assessment') {
        try {
          const courseResponse = await fetch('/api/course/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              assessment_result: result,
              answers: finalAnswers,
              quiz_type: type
            }),
          });

          if (courseResponse.ok) {
            const course = await courseResponse.json();
            setPersonalizedCourse(course);
            localStorage.setItem('personalized_course', JSON.stringify(course));
            localStorage.setItem('assessment_completed', 'true');
          }
        } catch (courseError) {
          console.error('Failed to generate course:', courseError);
        }
      }

      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const startPersonalizedCourse = () => {
    navigate('/dashboard');
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption('');
    setShowResult(false);
    setQuizResult(null);
    loadQuiz();
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized quiz...</p>
        </div>
      </div>
    );
  }

  if (showResult && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="mb-6 flex justify-center">
              <Sparkles className="h-12 w-12 text-primary-600" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {type === 'assessment' ? 'Assessment Complete' : quizResult.feedback.title}
            </h2>

            <div className="bg-primary-50 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {Math.round(quizResult.score)}%
              </div>
              <p className="text-gray-700 text-lg">
                {type === 'assessment'
                  ? "Great job! We've analyzed your skills and created a personalized learning journey just for you!"
                  : quizResult.feedback.message
                }
              </p>
            </div>

            <div className={`inline-block px-4 py-2 rounded-full text-white font-medium mb-6 ${
              quizResult.level === 'advanced' ? 'bg-yellow-500' :
              quizResult.level === 'intermediate' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {type === 'assessment' ? 'Skill Level' : 'Level'}: {quizResult.level.charAt(0).toUpperCase() + quizResult.level.slice(1)}
            </div>

            {/* Assessment-specific content */}
            {type === 'assessment' && personalizedCourse && (
              <div className="text-left mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Your Personalized CyberQuest Adventure
                </h3>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-800 mb-2">{personalizedCourse.title}</h4>
                  <p className="text-purple-700 mb-4">{personalizedCourse.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalizedCourse.modules && personalizedCourse.modules.map((module: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl font-semibold text-purple-600">
                            {module.name?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{module.name}</h5>
                            <p className="text-sm text-gray-600">{module.description}</p>
                            <span className="text-xs text-purple-600 font-medium">{module.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Regular quiz learning path */}
            {type !== 'assessment' && quizResult.learning_path && quizResult.learning_path.length > 0 && (
              <div className="text-left mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Your Personalized Learning Path
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizResult.learning_path.map((module: any, index: number) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-semibold text-primary-600">
                          {module.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{module.name}</h4>
                          <p className="text-sm text-gray-600">{module.description}</p>
                          <span className="text-xs text-primary-600 font-medium">{module.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {type === 'assessment' ? (
                <button
                  onClick={startPersonalizedCourse}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Start My Course</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={restartQuiz}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={goToDashboard}
                    className="btn-primary flex items-center justify-center"
                  >
                    Continue Learning
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your answers...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Brain className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              {type === 'assessment' ? 'Knowledge Assessment' : 'Practice Quiz'}
            </h2>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedOption === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Choose the best answer and click next
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                selectedOption
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
