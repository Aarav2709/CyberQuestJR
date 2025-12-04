import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import chapters, { type Chapter, findLessonById } from '../data/chapters';
import { calculateLessonProgress, useChapterProgress } from '../hooks/useChapterProgress';
import type { Lesson } from '../data/lessons';
import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';
import { useSound } from '../contexts/SoundContext';
import Confetti from '../components/Confetti';
import CertificateGenerator from '../components/CertificateGenerator';
import { BookOpen, Clock, CheckCircle2, PlayCircle, RotateCcw, ChevronRight, Lock } from 'lucide-react';

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
    <div className="min-h-screen">
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      {showCertificate && <CertificateGenerator onClose={() => setShowCertificate(false)} />}

      {/* Chapters Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch: Chapter, index: number) => {
            const status = progress[ch.id] ?? 'fresh';
            const completedLessons = getCompletedLessons(ch.id);
            const lessonEntries = ch.lessons
              .map((lessonId) => findLessonById(lessonId))
              .filter((lesson): lesson is Lesson => Boolean(lesson));
            const totalLessons = lessonEntries.length;
            const percent = status === 'complete' ? 100 : calculateLessonProgress(completedLessons.length, totalLessons);
            const readingTime = calculateReadingTime(lessonEntries);

            return (
              <div
                key={ch.id}
                className={`group relative rounded-3xl border bg-surface-200/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                  status === 'complete'
                    ? 'border-glow-lime/30 hover:border-glow-lime/50'
                    : status === 'started'
                    ? 'border-glow-amber/30 hover:border-glow-amber/50'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Chapter Number Badge */}
                <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 border border-white/10 text-xs font-bold text-white/60">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Status Indicator */}
                <div className="mb-4 flex items-center gap-2">
                  {status === 'complete' ? (
                    <div className="flex items-center gap-2 rounded-full bg-glow-lime/10 px-3 py-1 border border-glow-lime/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-glow-lime" />
                      <span className="text-xs font-medium text-glow-lime">Complete</span>
                    </div>
                  ) : status === 'started' ? (
                    <div className="flex items-center gap-2 rounded-full bg-glow-amber/10 px-3 py-1 border border-glow-amber/20">
                      <PlayCircle className="h-3.5 w-3.5 text-glow-amber" />
                      <span className="text-xs font-medium text-glow-amber">In Progress</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
                      <Lock className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-xs font-medium text-white/40">Not Started</span>
                    </div>
                  )}
                </div>

                {/* Title & Summary */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-colors">
                  {ch.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
                  {ch.summary}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {totalLessons} Lessons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatReadingTime(readingTime)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/40">{completedLessons.length}/{totalLessons} lessons</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        status === 'complete'
                          ? 'bg-glow-lime'
                          : 'bg-gradient-to-r from-glow-amber to-glow-orange'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/chapter/${ch.id}`}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    status === 'complete'
                      ? 'bg-white/5 text-white hover:bg-white/10'
                      : status === 'started'
                      ? 'bg-glow-amber/10 text-glow-amber hover:bg-glow-amber/20'
                      : 'bg-gradient-to-r from-glow-lime to-glow-amber text-black hover:shadow-lg hover:shadow-glow-amber/20'
                  }`}
                  onClick={() => {
                    playSound('click');
                    markStarted(ch.id);
                  }}
                >
                  {status === 'complete' ? (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Review Chapter
                    </>
                  ) : status === 'started' ? (
                    <>
                      Continue Learning
                      <ChevronRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Start Chapter
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JourneyPage;
