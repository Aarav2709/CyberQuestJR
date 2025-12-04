import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import chapters, { findLessonById } from '../data/chapters';
import type { Lesson } from '../data/lessons';
import InlineQuiz from '../components/InlineQuiz';
import Sidebar from '../components/Sidebar';
import TopScrollProgress from '../components/TopScrollProgress';
import { useChapterProgress } from '../hooks/useChapterProgress';
import { useSound } from '../contexts/SoundContext';
import { ArrowLeft, BookOpen, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';

// Import game components
import PasswordBuilder from '../components/games/PasswordBuilder';
import PhishingDetector from '../components/games/PhishingDetector';
import PrivacyAudit from '../components/games/PrivacyAudit';
import DeviceSecurityChecker from '../components/games/DeviceSecurityChecker';
import RumorTracker from '../components/games/RumorTracker';
import TwoFactorSetup from '../components/games/TwoFactorSetup';

const ChapterPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = chapters.find((c) => c.id === chapterId) || chapters[0];
  const { markLessonComplete, getCompletedLessons, markComplete, markStarted } = useChapterProgress();
  const { playSound } = useSound();

  const lessonEntries = useMemo(() => {
    return chapter.lessons
      .map((lessonId) => findLessonById(lessonId))
      .filter((lesson): lesson is Lesson => Boolean(lesson));
  }, [chapter]);

  const [activeLessonId, setActiveLessonId] = useState<string>(lessonEntries[0]?.id || '');
  const [lessonKey, setLessonKey] = useState(0);
  const scrollThreshold = useRef(80);

  useEffect(() => {
    if (lessonEntries.length) {
      setActiveLessonId(lessonEntries[0].id);
    }
  }, [chapterId, lessonEntries]);

  const currentLesson = lessonEntries.find((lesson) => lesson.id === activeLessonId) || lessonEntries[0] || null;
  const completedLessons = getCompletedLessons(chapter.id);
  const currentLessonIndex = lessonEntries.findIndex((l) => l.id === activeLessonId);

  useEffect(() => {
    if (lessonEntries.length > 0 && completedLessons.length === lessonEntries.length) {
      markComplete(chapter.id);
      playSound('achievement');
    } else if (completedLessons.length > 0) {
      markStarted(chapter.id);
    }
  }, [completedLessons.length, lessonEntries.length, chapter.id, markComplete, markStarted, playSound]);

  const isGameLesson = currentLesson?.id.endsWith('-game');

  const renderGameComponent = () => {
    if (!currentLesson) return null;

    const gameMap: Record<string, JSX.Element> = {
      'password-builder-game': <PasswordBuilder />,
      'phishing-detector-game': <PhishingDetector />,
      'privacy-audit-game': <PrivacyAudit />,
      'device-security-game': <DeviceSecurityChecker />,
      'rumor-tracker-game': <RumorTracker />,
      '2fa-setup-game': <TwoFactorSetup />,
    };

    return gameMap[currentLesson.id] || null;
  };

  useEffect(() => {
    if (!currentLesson) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (scrollPercent >= scrollThreshold.current && !completedLessons.includes(currentLesson.id)) {
        markLessonComplete(chapter.id, currentLesson.id);
        playSound('click');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentLesson, completedLessons, chapter.id, markLessonComplete, playSound]);

  const handleLessonSelect = (id: string) => {
    setActiveLessonId(id);
    setLessonKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound('click');
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < lessonEntries.length - 1) {
      handleLessonSelect(lessonEntries[currentLessonIndex + 1].id);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      handleLessonSelect(lessonEntries[currentLessonIndex - 1].id);
    }
  };

  return (
    <>
      <TopScrollProgress key={lessonKey} />

      {/* Back Navigation */}
      <div className="border-b border-white/5 bg-surface-200/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <Link
            to="/learn"
            onClick={() => playSound('click')}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journey
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 sm:px-6 py-8">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
          <Sidebar
            chapterId={chapter.id}
            chapterTitle={chapter.title}
            lessons={lessonEntries}
            activeLessonId={currentLesson?.id || ''}
            onSelectLesson={handleLessonSelect}
          />
        </aside>

        {/* Main Content */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Chapter Header */}
          <div className="rounded-3xl border border-white/10 bg-surface-200/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-glow-lime/10 border border-glow-lime/20">
                <BookOpen className="h-4 w-4 text-glow-lime" />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">Chapter Focus</p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{chapter.title}</h2>
            <p className="text-white/60">{chapter.summary}</p>
          </div>

          {currentLesson ? (
            <article className="space-y-6">
              {/* Lesson Header */}
              <div className="rounded-3xl border border-white/10 bg-surface-100/80 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-glow-amber">
                    {isGameLesson ? 'Interactive Activity' : `Lesson ${currentLessonIndex + 1} of ${lessonEntries.length}`}
                  </p>
                  {completedLessons.includes(currentLesson.id) && (
                    <div className="flex items-center gap-1.5 rounded-full bg-glow-lime/10 px-3 py-1 border border-glow-lime/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-glow-lime" />
                      <span className="text-xs font-medium text-glow-lime">Completed</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{currentLesson.title}</h3>
                <p className="text-white/60">{currentLesson.summary}</p>
              </div>

              {isGameLesson ? (
                <div className="space-y-6">
                  {renderGameComponent()}

                  {currentLesson.narrative.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-surface-100/50 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="h-5 w-5 text-glow-amber" />
                        <h4 className="text-lg font-semibold text-white">About This Activity</h4>
                      </div>
                      <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                        {currentLesson.narrative.map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Narrative Content */}
                  <div className="rounded-3xl border border-white/10 bg-surface-200/50 p-6 backdrop-blur-sm">
                    <div className="prose prose-invert max-w-none space-y-5 text-base leading-relaxed text-white/80">
                      {currentLesson.narrative.map((para, idx) => (
                        <p key={idx} className="hover:text-white/90 transition-colors">{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Coach Q&A */}
                  {currentLesson.coachQuestions.length > 0 && (
                    <div className="rounded-3xl border border-white/10 bg-surface-100/80 p-6 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-glow-amber/10 border border-glow-amber/20">
                          <MessageSquare className="h-5 w-5 text-glow-amber" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">Coach Q+A</h4>
                          <p className="text-xs text-white/50">Read each scenario aloud and explain the answer</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {currentLesson.coachQuestions.map((pair, idx) => (
                          <div key={pair.question} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/8">
                            <p className="font-semibold text-white mb-3">
                              <span className="text-glow-amber mr-2">Q{idx + 1}:</span>
                              {pair.question}
                            </p>
                            <p className="text-sm text-white/70 leading-relaxed">
                              <span className="text-glow-lime font-medium mr-2">A:</span>
                              {pair.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quiz Section */}
                  {currentLesson.quizzes.length > 0 && (
                    <div className="quiz-card rounded-3xl">
                      <InlineQuiz quizzes={currentLesson.quizzes} />
                    </div>
                  )}
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                {currentLessonIndex < lessonEntries.length - 1 ? (
                  <button
                    onClick={goToNextLesson}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-glow-amber/30"
                  >
                    Next Lesson
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                ) : (
                  <Link
                    to="/learn"
                    onClick={() => playSound('click')}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-glow-amber/30"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Chapter
                  </Link>
                )}
              </div>
            </article>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-surface-200/50 p-12 text-center">
              <p className="text-white/60">No lesson found</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ChapterPage;
