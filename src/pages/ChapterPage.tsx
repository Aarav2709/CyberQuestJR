import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import chapters, { findLessonById } from '../data/chapters';
import type { Lesson } from '../data/lessons';
import InlineQuiz from '../components/InlineQuiz';
import Sidebar from '../components/Sidebar';
import TopScrollProgress from '../components/TopScrollProgress';
import { useChapterProgress } from '../hooks/useChapterProgress';

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
  const lessonEntries = useMemo(() => {
    return chapter.lessons
      .map((lessonId) => findLessonById(lessonId))
      .filter((lesson): lesson is Lesson => Boolean(lesson));
  }, [chapter]);

  const [activeLessonId, setActiveLessonId] = useState<string>(lessonEntries[0]?.id || '');
  const [lessonKey, setLessonKey] = useState(0); // Force scroll recalculation
  const scrollThreshold = useRef(80); // Mark complete at 80% scroll

  useEffect(() => {
    if (lessonEntries.length) {
      setActiveLessonId(lessonEntries[0].id);
    }
  }, [chapterId, lessonEntries]);

  const currentLesson = lessonEntries.find((lesson) => lesson.id === activeLessonId) || lessonEntries[0] || null;
  const completedLessons = getCompletedLessons(chapter.id);

  // Check if all lessons are complete and mark chapter as complete
  useEffect(() => {
    if (lessonEntries.length > 0 && completedLessons.length === lessonEntries.length) {
      markComplete(chapter.id);
    } else if (completedLessons.length > 0) {
      markStarted(chapter.id);
    }
  }, [completedLessons.length, lessonEntries.length, chapter.id, markComplete, markStarted]);

  // Check if current lesson is a game
  const isGameLesson = currentLesson?.id.endsWith('-game');

  // Render appropriate game component
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

  // Auto-mark lesson complete when scrolled to 80%
  useEffect(() => {
    if (!currentLesson) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (scrollPercent >= scrollThreshold.current && !completedLessons.includes(currentLesson.id)) {
        markLessonComplete(chapter.id, currentLesson.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentLesson, completedLessons, chapter.id, markLessonComplete]);

  const handleLessonSelect = (id: string) => {
    setActiveLessonId(id);
    setLessonKey(prev => prev + 1); // Trigger scroll recalculation
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <TopScrollProgress key={lessonKey} />
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6 px-6 py-10">
        <aside className="col-span-12 lg:col-span-4 space-y-4">
        <Sidebar
          chapterTitle={chapter.title}
          lessons={lessonEntries}
          activeLessonId={currentLesson?.id || ''}
          onSelectLesson={handleLessonSelect}
        />
      </aside>

      <section className="col-span-12 space-y-8 rounded-3xl border border-white/5 bg-surface-200/70 p-6 lg:col-span-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Lesson Focus</p>
          <h2 className="text-3xl font-semibold text-white">{chapter.title}</h2>
          <p className="mt-2 text-white/70">{chapter.summary}</p>
        </div>

        {currentLesson ? (
          <article className="space-y-8">
            <header className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">Now Reading</p>
              <h3 className="text-2xl font-semibold text-white">{currentLesson.title}</h3>
              <p className="mt-2 text-white/75">{currentLesson.summary}</p>
            </header>

            {isGameLesson ? (
              // Render interactive game
              <div className="space-y-6">
                {renderGameComponent()}

                {currentLesson.narrative.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <h4 className="text-lg font-semibold text-white mb-3">About This Activity</h4>
                    <div className="space-y-3 text-sm text-white/80">
                      {currentLesson.narrative.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Render regular lesson content
              <>
                <div className="space-y-6 text-base leading-relaxed text-white/80">
                  {currentLesson.narrative.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="rounded-3xl border border-white/10 bg-surface-100/80 p-5">
                  <h4 className="text-xl font-semibold text-white">Coach Q + A</h4>
                  <p className="text-sm text-white/60">Read every scenario, then explain the answer out loud.</p>
                  <div className="mt-4 space-y-4">
                    {currentLesson.coachQuestions.map((pair) => (
                      <div key={pair.question} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="font-semibold text-white">Q: {pair.question}</p>
                        <p className="mt-2 text-sm text-white/75">A: {pair.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {currentLesson.quizzes.length > 0 && (
                  <div className="quiz-card">
                    <InlineQuiz quizzes={currentLesson.quizzes} />
                  </div>
                )}
              </>
            )}
          </article>
        ) : (
          <p className="text-white/70">No Lesson found.</p>
        )}
      </section>
      </div>
    </>
  );
};

export default ChapterPage;
