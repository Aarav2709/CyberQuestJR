import { Link } from 'react-router-dom';
import chapters, { type Chapter, findLessonById } from '../data/chapters';
import { calculateLessonProgress, useChapterProgress } from '../hooks/useChapterProgress';
import type { Lesson } from '../data/lessons';

const JourneyPage: React.FC = () => {
  const { progress, markStarted, getCompletedLessons } = useChapterProgress();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Chapter Navigator</p>
        <h2 className="text-3xl font-semibold text-white">Pick a scene and mark your progress.</h2>
        <p className="text-sm text-white/60">
          Opening a chapter marks it as "In Progress." Complete each lesson's quizzes and mark them complete to track your progress through the chapter.
        </p>
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
            status === 'fresh' ? 'Not Started' : status === 'complete' ? 'Complete' : 'In Progress';
          return (
            <li key={ch.id} className="rounded-3xl border border-white/10 bg-surface-100/80 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40">Chapter {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="text-2xl font-semibold text-white">{ch.title}</h3>
                  <p className="mt-2 text-sm text-white/65">{ch.summary}</p>
                </div>
                <div className="text-right text-sm text-white/60">
                  <p>{totalLessons} Lesson{totalLessons === 1 ? '' : 's'}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{percent}% Complete</span>
                  <span>{statusLabel}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-gradient-to-r from-glow-lime via-glow-amber to-glow-orange" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs uppercase tracking-[0.4em] text-white/40">Actions</div>
                <Link
                  to={`/chapter/${ch.id}`}
                  className="text-glow-amber focus-ring text-sm font-semibold"
                  onClick={() => markStarted(ch.id)}
                >
                  Open Chapter
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
