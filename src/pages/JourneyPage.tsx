import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import chapters, { type Chapter, findLessonById } from '../data/chapters';
import { calculateLessonProgress, useChapterProgress } from '../hooks/useChapterProgress';
import type { Lesson } from '../data/lessons';
import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';
import { useSound } from '../contexts/SoundContext';
import Confetti from '../components/Confetti';
import CertificateGenerator from '../components/CertificateGenerator';

const JourneyPage: React.FC = () => {
  const { progress, markStarted, getCompletedLessons } = useChapterProgress();
  const { playSound } = useSound();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const allComplete = chapters.every(ch => progress[ch.id] === 'complete');
  const completedCount = chapters.filter(ch => progress[ch.id] === 'complete').length;

  useEffect(() => {
    if (allComplete && completedCount === chapters.length) {
      setShowConfetti(true);
      playSound('achievement');
    }
  }, [allComplete, completedCount, playSound]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      {showCertificate && <CertificateGenerator onClose={() => setShowCertificate(false)} />}

      <div className="mb-8 space-y-3">
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: 'var(--text-secondary)' }}>Chapter Navigator</p>
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Your Cybersecurity Journey</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Complete lessons to track your progress. Scroll through each lesson to auto-complete it!
        </p>

        <div className="rounded-2xl border p-4 mt-6" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface-100)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Overall Progress</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{completedCount} / {chapters.length} Chapters</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <div
              className="h-full bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange transition-all duration-500"
              style={{ width: `${(completedCount / chapters.length) * 100}%` }}
            />
          </div>
        </div>

        {allComplete && (
          <button
            onClick={() => {
              playSound('achievement');
              setShowCertificate(true);
            }}
            className="w-full rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-6 py-4 font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all mt-4 animate-fadeIn"
          >
            Download Your Certificate of Completion
          </button>
        )}
      </div>

      <ol className="space-y-4">
        {chapters.map((ch: Chapter, index: number) => {
          const status = progress[ch.id] ?? 'fresh';
          const completedLessons = getCompletedLessons(ch.id);
          const lessonEntries = ch.lessons
            .map((lessonId) => findLessonById(lessonId))
            .filter((lesson): lesson is Lesson => Boolean(lesson));
          const totalLessons = lessonEntries.length;
          const percent = status === 'complete' ? 100 : calculateLessonProgress(completedLessons.length, totalLessons);
          const statusLabel =
            status === 'complete' ? 'Complete' : status === 'started' ? 'In Progress' : 'Not Started';
          const readingTime = calculateReadingTime(lessonEntries);

          return (
            <li key={ch.id} className="rounded-3xl border p-5 transition-all hover:scale-[1.01]" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface-100)' }}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em]" style={{ color: 'var(--text-secondary)' }}>Chapter {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{ch.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{ch.summary}</p>
                </div>
                <div className="text-right text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>{totalLessons} Lesson{totalLessons === 1 ? '' : 's'}</p>
                  <p className="text-glow-amber font-semibold">{formatReadingTime(readingTime)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>{percent}% Complete</span>
                  <span className={status === 'complete' ? 'text-green-400' : status === 'started' ? 'text-yellow-400' : ''}>{statusLabel}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                  <div className="h-full bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange transition-all duration-300" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className={`text-xs uppercase tracking-[0.4em] ${status === 'complete' ? 'text-green-400' : status === 'started' ? 'text-yellow-400' : ''}`} style={status === 'fresh' ? { color: 'var(--text-secondary)' } : {}}>
                  {status === 'complete' ? 'Completed' : status === 'started' ? 'In Progress' : 'Ready to Start'}
                </div>
                <Link
                  to={`/chapter/${ch.id}`}
                  className="text-glow-amber focus-ring text-sm font-semibold hover:text-glow-lime transition-colors"
                  onClick={() => {
                    playSound('click');
                    markStarted(ch.id);
                  }}
                >
                  {status === 'fresh' ? 'Start Chapter' : status === 'complete' ? 'Review Chapter' : 'Continue'}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default JourneyPage;
