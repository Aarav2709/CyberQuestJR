import type { FC } from 'react';
import type { Lesson } from '../data/lessons';
import { BookOpen, CheckCircle2, Circle, Gamepad2 } from 'lucide-react';
import { useChapterProgress } from '../hooks/useChapterProgress';

type Props = {
  chapterId: string;
  chapterTitle: string;
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
};

const Sidebar: FC<Props> = ({ chapterId, chapterTitle, lessons, activeLessonId, onSelectLesson }) => {
  const { getCompletedLessons } = useChapterProgress();
  const completedLessons = getCompletedLessons(chapterId);
  const completionPercent = Math.round((completedLessons.length / lessons.length) * 100);

  return (
    <div className="sticky top-24 space-y-4">
      {/* Chapter Header Card */}
      <div className="rounded-2xl border border-white/10 bg-surface-100/80 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-glow-amber/10 border border-glow-amber/20">
            <BookOpen className="h-5 w-5 text-glow-amber" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">Current Chapter</p>
            <h4 className="text-lg font-semibold text-white leading-tight">{chapterTitle}</h4>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">{completedLessons.length} of {lessons.length} lessons</span>
            <span className="font-semibold text-glow-lime">{completionPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-glow-lime to-glow-amber transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="rounded-2xl border border-white/10 bg-surface-200/80 p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-3 px-1">Lesson Outline</p>
        <ul className="space-y-2">
          {lessons.map((lesson, index) => {
            const isActive = lesson.id === activeLessonId;
            const isCompleted = completedLessons.includes(lesson.id);
            const isGame = lesson.id.endsWith('-game');

            return (
              <li key={lesson.id}>
                <button
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all focus-ring ${
                    isActive
                      ? 'border-glow-amber/50 bg-glow-amber/10'
                      : 'border-transparent hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-glow-lime" />
                    ) : isActive ? (
                      <Circle className="h-4 w-4 text-glow-amber fill-glow-amber/20" />
                    ) : (
                      <Circle className="h-4 w-4 text-white/30" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[0.65rem] uppercase tracking-wider text-white/40">
                        {isGame ? 'Activity' : `Lesson ${index + 1}`}
                      </p>
                      {isGame && <Gamepad2 className="h-3 w-3 text-glow-lime" />}
                    </div>
                    <p className={`text-sm font-medium leading-tight truncate ${
                      isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/60'
                    }`}>
                      {lesson.title}
                    </p>
                  </div>

                  {/* Difficulty Badge */}
                  <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    lesson.difficulty === 'beginner'
                      ? 'bg-green-500/10 text-green-400'
                      : lesson.difficulty === 'intermediate'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {lesson.difficulty}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
