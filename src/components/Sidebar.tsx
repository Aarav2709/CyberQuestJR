import type { FC } from 'react';
import type { Lesson } from '../data/lessons';

type Props = {
  chapterTitle: string;
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
};

const Sidebar: FC<Props> = ({ chapterTitle, lessons, activeLessonId, onSelectLesson }) => {
  return (
    <div className="sticky top-24 space-y-5">
      <div className="rounded-2xl border border-white/10 bg-surface-100/80 p-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Chapter</p>
        <h4 className="text-xl font-semibold text-white">{chapterTitle}</h4>
        <p className="text-sm text-white/60">{lessons.length} lesson{lessons.length === 1 ? '' : 's'}</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-surface-200/80 p-3 shadow-neon-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">Outline</p>
        <ul className="mt-3 space-y-2">
          {lessons.map((lesson, index) => {
            const active = lesson.id === activeLessonId;
            return (
              <li key={lesson.id}>
                <button
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition focus-ring ${
                    active
                      ? 'border-glow-amber/80 bg-glow-amber/10 text-white'
                      : 'border-white/10 bg-transparent text-white/70 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <p className="text-xs text-white/50">Lesson {index + 1}</p>
                    <p className="font-semibold text-white">{lesson.title}</p>
                  </div>
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
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
