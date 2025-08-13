import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const AssessmentQuiz = () => {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    experience: ''
  });
  const [showUserForm, setShowUserForm] = useState(true);

  const questions: Question[] = [
    {
      id: 1,
      question: "What makes a password strong and secure?",
      options: [
        "Using your birthday",
        "Using a mix of letters, numbers, and symbols",
        "Using your pet's name",
        "Using '123456'"
      ],
      correctAnswer: 1,
      explanation: "Strong passwords use a combination of uppercase letters, lowercase letters, numbers, and special symbols!"
    },
    {
      id: 2,
      question: "What should you do if you receive an email asking for your password?",
      options: [
        "Reply with your password immediately",
        "Share it with your friends first",
        "Never give your password to anyone via email",
        "Ask your parents for their password instead"
      ],
      correctAnswer: 2,
      explanation: "Legitimate companies will never ask for your password via email. This is called phishing!"
    },
    {
      id: 3,
      question: "What is a digital footprint?",
      options: [
        "A shoe print on your computer",
        "Traces of your online activity",
        "A special kind of emoji",
        "A computer virus"
      ],
      correctAnswer: 1,
      explanation: "Your digital footprint is all the traces you leave behind when you use the internet!"
    },
    {
      id: 4,
      question: "What should you do if someone is being mean to you online?",
      options: [
        "Be mean back to them",
        "Ignore it and tell a trusted adult",
        "Share their personal information",
        "Create fake accounts to get back at them"
      ],
      correctAnswer: 1,
      explanation: "Always tell a trusted adult about cyberbullying and never respond with more meanness!"
    },
    {
      id: 5,
      question: "What information is safe to share on social media?",
      options: [
        "Your home address",
        "Your school's name and location",
        "Your hobbies and interests (without personal details)",
        "Your full name and phone number"
      ],
      correctAnswer: 2,
      explanation: "Share your interests and hobbies, but keep personal information like addresses and phone numbers private!"
    }
  ];

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.age && userInfo.experience) {
      setShowUserForm(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getPersonalizedRecommendation = () => {
    const score = calculateScore();
    const age = parseInt(userInfo.age);

    if (score >= 80) {
      return {
        level: "Advanced Explorer! 🌟",
        message: "Wow! You already know a lot about cybersecurity. You're ready for intermediate and advanced courses!",
        recommendedCourses: ["digital-footprints", "social-media-safety", "privacy-guardian"]
      };
    } else if (score >= 60) {
      return {
        level: "Cyber Cadet! 🚀",
        message: "Great job! You have some good knowledge. Let's build on that with some beginner and intermediate courses!",
        recommendedCourses: ["password-basics", "phishing-awareness", "digital-footprints"]
      };
    } else {
      return {
        level: "Future Cyber Hero! 💪",
        message: "Perfect! You're just starting your cybersecurity journey. Let's begin with the basics and work our way up!",
        recommendedCourses: ["password-basics", "phishing-awareness", "cyber-bullying"]
      };
    }
  };

  const completeAssessment = () => {
    const score = calculateScore();
    const recommendation = getPersonalizedRecommendation();

    // Store assessment results
    localStorage.setItem('assessment_completed', 'true');
    localStorage.setItem('assessment_score', score.toString());
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    localStorage.setItem('personalized_recommendation', JSON.stringify(recommendation));

    // Navigate to learn page or dashboard
    navigate('/dashboard');
  };

  if (showUserForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <Brain className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              🧠 Cybersecurity Assessment
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Let's get to know you first! This helps us personalize your learning experience.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleUserSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  What's your name? 😊
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  How old are you? 🎂
                </label>
                <select
                  value={userInfo.age}
                  onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your age</option>
                  {Array.from({length: 11}, (_, i) => i + 8).map(age => (
                    <option key={age} value={age}>{age} years old</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  How much do you know about online safety? 🤔
                </label>
                <select
                  value={userInfo.experience}
                  onChange={(e) => setUserInfo({...userInfo, experience: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose your level</option>
                  <option value="beginner">I'm just starting to learn 🌱</option>
                  <option value="some">I know a little bit 🌿</option>
                  <option value="good">I know quite a bit 🌳</option>
                  <option value="expert">I'm already pretty good! 🌟</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Start Assessment Quiz! 🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const recommendation = getPersonalizedRecommendation();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              🎉 Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Great job, {userInfo.name}! Here are your results:
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-primary-600 mb-2">{score}%</div>
              <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                {recommendation.level}
              </div>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-6 mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
                {recommendation.message}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                📚 Your Personalized Learning Path:
              </h3>
              {recommendation.recommendedCourses.map((courseId, index) => (
                <div key={courseId} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 capitalize">
                    {courseId.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={completeAssessment}
              className="w-full mt-8 bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-lg"
            >
              Start Learning Journey! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Question {currentQuestion + 1} of {questions.length}
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuiz;
