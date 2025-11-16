import { useState } from 'react';

type LinkExample = {
  url: string;
  isPhishing: boolean;
  reason: string;
};

const links: LinkExample[] = [
  {
    url: 'https://www.paypal.com/signin',
    isPhishing: false,
    reason: 'Legitimate PayPal domain with HTTPS',
  },
  {
    url: 'http://paypa1.com/verify-account',
    isPhishing: true,
    reason: 'Suspicious: uses "1" instead of "l", no HTTPS, asks to verify',
  },
  {
    url: 'https://www.instagram.com/explore',
    isPhishing: false,
    reason: 'Real Instagram domain with HTTPS',
  },
  {
    url: 'https://instagram-security.com/account-suspended',
    isPhishing: true,
    reason: 'Fake domain pretending to be Instagram, creating urgency',
  },
  {
    url: 'https://www.amazon.com/orders',
    isPhishing: false,
    reason: 'Official Amazon domain with HTTPS',
  },
  {
    url: 'http://amaz0n-prize.net/claim-now',
    isPhishing: true,
    reason: 'Uses "0" instead of "o", suspicious domain, no HTTPS, too good to be true',
  },
  {
    url: 'https://docs.google.com/forms/d/abc123',
    isPhishing: false,
    reason: 'Legitimate Google Forms link',
  },
  {
    url: 'https://bit.ly/free-robux-2024',
    isPhishing: true,
    reason: 'Shortened URL hiding destination, promises free items (common scam)',
  },
];

const PhishingDetector: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const currentLink = links[currentIndex];
  const totalQuestions = links.length;

  const handleAnswer = (isPhishing: boolean) => {
    setSelectedAnswer(isPhishing);
    setAnswered(true);

    if (isPhishing === currentLink.isPhishing) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < links.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const isCorrect = selectedAnswer === currentLink.isPhishing;
  const isComplete = currentIndex === links.length - 1 && answered;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-white">🔍 Phishing Link Detective</h3>
        <p className="mt-2 text-sm text-white/70">Can you spot the fake links? Check each URL carefully.</p>
      </div>

      {!isComplete ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
            <span className="text-sm text-white/60">Question {currentIndex + 1} of {totalQuestions}</span>
            <span className="text-sm font-semibold text-glow-amber">Score: {score}/{totalQuestions}</span>
          </div>

          <div className="rounded-xl border border-white/20 bg-black/40 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Examine this link:</p>
            <div className="font-mono text-sm text-white break-all bg-black/50 rounded-lg p-3 border border-white/10">
              {currentLink.url}
            </div>
          </div>

          {!answered ? (
            <div className="space-y-3">
              <p className="text-sm text-white/80">Is this link safe or a phishing attempt?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer(false)}
                  className="rounded-xl border-2 border-green-500/50 bg-green-500/10 px-4 py-3 text-green-300 hover:bg-green-500/20 hover:border-green-500 transition-all font-semibold"
                >
                  ✓ Safe Link
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="rounded-xl border-2 border-red-500/50 bg-red-500/10 px-4 py-3 text-red-300 hover:bg-red-500/20 hover:border-red-500 transition-all font-semibold"
                >
                  ⚠️ Phishing
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <div className={`rounded-xl border p-4 ${isCorrect ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="text-sm text-white/80">
                  This link is <strong>{currentLink.isPhishing ? 'PHISHING' : 'SAFE'}</strong>.
                </p>
                <p className="text-sm text-white/70 mt-2">
                  {currentLink.reason}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-4 py-3 font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all"
              >
                Next Question →
              </button>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
            <p className="font-semibold text-white/80 mb-2">🔎 What to look for:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Check for HTTPS (the padlock icon)</li>
              <li>Look for misspellings in the domain</li>
              <li>Watch for character substitutions (0 for o, 1 for l)</li>
              <li>Be suspicious of shortened URLs</li>
              <li>Question urgent or too-good-to-be-true messages</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <div className="rounded-xl border border-glow-amber/30 bg-glow-amber/10 p-6 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-2xl font-semibold text-white mb-2">Quiz Complete!</p>
            <p className="text-3xl font-bold text-glow-amber mb-2">{score} / {totalQuestions}</p>
            <p className="text-sm text-white/70">
              {score === totalQuestions ? 'Perfect score! You\'re a phishing detection expert!' :
               score >= totalQuestions * 0.7 ? 'Great job! You caught most of the phishing attempts.' :
               'Keep practicing! Phishing detection takes time to master.'}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white hover:bg-white/20 transition-all font-semibold"
          >
            ↻ Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PhishingDetector;
