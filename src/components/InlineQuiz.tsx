import { useState } from 'react';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import type { LessonQuiz } from '../data/lessons';

interface InlineQuizProps {
  quizzes: LessonQuiz[];
}

const InlineQuiz: React.FC<InlineQuizProps> = ({ quizzes }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const currentQuiz = quizzes[activeIndex];

  if (!currentQuiz) return null;

  const submit = () => {
    if (!selected) return;
    const correct = selected === currentQuiz.answer;
    setStatus(correct ? 'correct' : 'incorrect');
  };

  const reset = () => {
    setSelected(null);
    setStatus('idle');
  };

  const goTo = (nextIndex: number) => {
    setActiveIndex(nextIndex);
    setSelected(null);
    setStatus('idle');
  };

  const prevDisabled = activeIndex === 0;
  const nextDisabled = activeIndex === quizzes.length - 1;

  return (
    <div className="rounded-3xl border border-white/10 bg-surface-100/90 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Checkpoint</p>
          <p className="text-sm text-white/60">
            Question {String(activeIndex + 1).padStart(2, '0')} of {String(quizzes.length).padStart(2, '0')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={prevDisabled}
            className="focus-ring rounded-full border border-white/20 p-2 text-white/70 disabled:opacity-30"
            aria-label="Previous quiz"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={nextDisabled}
            className="focus-ring rounded-full border border-white/20 p-2 text-white/70 disabled:opacity-30"
            aria-label="Next quiz"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h4 className="mt-4 text-xl font-semibold text-white">{currentQuiz.question}</h4>

      <div className="mt-4 space-y-3">
        {currentQuiz.options.map((option) => {
          const isChosen = selected === option;
          const isCorrect = status === 'correct' && option === currentQuiz.answer;
          const isWrongChoice = status === 'incorrect' && isChosen;

          return (
            <button
              key={option}
              onClick={() => setSelected(option)}
              disabled={status !== 'idle'}
              className={`focus-ring flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                isCorrect
                  ? 'border-emerald-300/70 bg-emerald-400/10 text-emerald-100'
                  : isWrongChoice
                  ? 'border-rose-400/70 bg-rose-400/10 text-rose-100'
                  : isChosen
                  ? 'border-glow-amber/70 bg-glow-amber/10 text-white'
                  : 'border-white/10 bg-night text-white/70 hover:border-glow-amber/40'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isWrongChoice ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {status === 'idle' ? (
          <button
            onClick={submit}
            disabled={!selected}
            className="btn-primary focus-ring disabled:opacity-40"
          >
            Check answer
          </button>
        ) : (
          <>
            <button
              onClick={reset}
              className="btn-secondary focus-ring"
            >
              Try another scenario
            </button>
            <p
              className={`text-sm font-medium ${
                status === 'correct' ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {status === 'correct' ? 'Locked in' : 'Review and retry'}
            </p>
          </>
        )}
      </div>

      {status !== 'idle' && (
        <p className="mt-4 text-sm text-white/70" aria-live="polite">{currentQuiz.rationale}</p>
      )}
    </div>
  );
};

export default InlineQuiz;
