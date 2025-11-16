import { useState } from 'react';

type Message = {
  id: number;
  from: string;
  content: string;
  isRumor: boolean;
  redFlags: string[];
  time: string;
};

const messages: Message[] = [
  {
    id: 1,
    from: 'Unknown Number',
    content: 'OMG did you hear about Sarah?? She got arrested last night! Share this before it gets deleted!!!',
    isRumor: true,
    redFlags: ['Unknown source', 'Creates urgency ("share before deleted")', 'No verifiable details', 'Sensational claim'],
    time: '2:34 PM',
  },
  {
    id: 2,
    from: 'School Principal',
    content: 'Tomorrow is a snow day. School is cancelled. Official announcement on the school website.',
    isRumor: false,
    redFlags: [],
    time: '6:15 PM',
  },
  {
    id: 3,
    from: 'Friend',
    content: 'Everyone forward this or your account will be deleted in 24 hours! Instagram is removing inactive accounts!',
    isRumor: true,
    redFlags: ['Chain message pattern', 'Fear tactic', 'False deadline', 'No official source'],
    time: '7:02 PM',
  },
  {
    id: 4,
    from: 'News App',
    content: 'Local weather alert: Heavy rain expected tonight. Drive safely.',
    isRumor: false,
    redFlags: [],
    time: '8:20 PM',
  },
  {
    id: 5,
    from: 'Classmate',
    content: 'Mr. Johnson said test is cancelled tomorrow, pass it on quickly!!!',
    isRumor: true,
    redFlags: ['Secondhand information', 'Creates urgency', 'Too good to be true', 'Not from official source'],
    time: '9:45 PM',
  },
];

const RumorTracker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ messageId: number; choice: 'freeze' | 'share' }[]>([]);
  const [showResult, setShowResult] = useState(false);

  const currentMessage = messages[currentIndex];
  const isComplete = currentIndex >= messages.length;

  const handleDecision = (choice: 'freeze' | 'share') => {
    setDecisions([...decisions, { messageId: currentMessage.id, choice }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < messages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setDecisions([]);
    setShowResult(false);
  };

  const correctDecisions = decisions.filter((d, idx) => {
    const msg = messages[idx];
    return (msg.isRumor && d.choice === 'freeze') || (!msg.isRumor && d.choice === 'share');
  }).length;

  const scorePercent = decisions.length > 0 ? Math.round((correctDecisions / decisions.length) * 100) : 0;

  if (isComplete) {
    return (
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-white">❄️ Rumor Command Center</h3>
          <p className="mt-2 text-sm text-white/70">Freeze rumors before they spread.</p>
        </div>

        <div className="space-y-4 animate-fadeIn">
          <div className={`rounded-xl border p-6 text-center ${
            scorePercent === 100 ? 'border-green-500/30 bg-green-500/10' :
            scorePercent >= 70 ? 'border-yellow-500/30 bg-yellow-500/10' :
            'border-red-500/30 bg-red-500/10'
          }`}>
            <p className="text-4xl mb-2">
              {scorePercent === 100 ? '🎉' : scorePercent >= 70 ? '👍' : '📚'}
            </p>
            <p className="text-2xl font-semibold text-white mb-2">Mission Complete!</p>
            <p className="text-3xl font-bold text-glow-amber mb-2">{correctDecisions} / {decisions.length}</p>
            <p className="text-sm text-white/70">
              {scorePercent === 100 ? 'Perfect! You stopped all the rumors!' :
               scorePercent >= 70 ? 'Good work! You caught most of the rumors.' :
               'Keep practicing! Spotting rumors takes skill.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white mb-3">Review Your Decisions</p>
            <div className="space-y-2">
              {decisions.map((decision, idx) => {
                const msg = messages[idx];
                const wasCorrect = (msg.isRumor && decision.choice === 'freeze') || (!msg.isRumor && decision.choice === 'share');
                return (
                  <div key={decision.messageId} className={`rounded-lg border p-2 text-xs ${
                    wasCorrect ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={wasCorrect ? 'text-green-300' : 'text-red-300'}>
                        {wasCorrect ? '✓' : '✗'} Message {idx + 1}
                      </span>
                      <span className="text-white/60">
                        You: {decision.choice === 'freeze' ? '❄️ Froze' : '📤 Shared'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white hover:bg-white/20 transition-all font-semibold"
          >
            ↻ Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-white">❄️ Rumor Command Center</h3>
        <p className="mt-2 text-sm text-white/70">Freeze rumors before they spread. Think carefully before sharing!</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
          <span className="text-sm text-white/60">Message {currentIndex + 1} of {messages.length}</span>
          <span className="text-sm font-semibold text-glow-amber">Score: {correctDecisions}/{decisions.length}</span>
        </div>

        {!showResult ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">{currentMessage.from}</span>
                <span className="text-xs text-white/50">{currentMessage.time}</span>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-white">{currentMessage.content}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/80 mb-3">What should you do with this message?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDecision('freeze')}
                  className="rounded-xl border-2 border-blue-500/50 bg-blue-500/10 px-4 py-3 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500 transition-all font-semibold"
                >
                  ❄️ Freeze It
                  <p className="text-xs font-normal text-white/60 mt-1">Don't share</p>
                </button>
                <button
                  onClick={() => handleDecision('share')}
                  className="rounded-xl border-2 border-green-500/50 bg-green-500/10 px-4 py-3 text-green-300 hover:bg-green-500/20 hover:border-green-500 transition-all font-semibold"
                >
                  📤 Share It
                  <p className="text-xs font-normal text-white/60 mt-1">Pass it on</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className={`rounded-xl border p-4 ${
              (currentMessage.isRumor && decisions[decisions.length - 1].choice === 'freeze') ||
              (!currentMessage.isRumor && decisions[decisions.length - 1].choice === 'share')
                ? 'border-green-500/30 bg-green-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}>
              <p className={`font-semibold mb-2 ${
                (currentMessage.isRumor && decisions[decisions.length - 1].choice === 'freeze') ||
                (!currentMessage.isRumor && decisions[decisions.length - 1].choice === 'share')
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {(currentMessage.isRumor && decisions[decisions.length - 1].choice === 'freeze') ||
                (!currentMessage.isRumor && decisions[decisions.length - 1].choice === 'share')
                  ? '✓ Correct Decision!'
                  : '✗ Think Again!'}
              </p>
              <p className="text-sm text-white/80 mb-2">
                This message is <strong>{currentMessage.isRumor ? 'A RUMOR' : 'LEGITIMATE'}</strong>.
              </p>
              {currentMessage.isRumor && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/80 mb-2">🚩 Red Flags Detected:</p>
                  <ul className="text-xs text-white/70 space-y-1">
                    {currentMessage.redFlags.map((flag, idx) => (
                      <li key={idx}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-4 py-3 font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all"
            >
              Next Message →
            </button>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
          <p className="font-semibold text-white/80 mb-2">❄️ Freeze Strategy:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Pause before sharing anything</li>
            <li>Check if the source is trustworthy</li>
            <li>Look for verification from official sources</li>
            <li>Watch for urgency tactics and fear language</li>
            <li>If uncertain, don't share - ask an adult</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RumorTracker;
