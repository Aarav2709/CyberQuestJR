import type { Lesson } from '../data/lessons';

export function calculateReadingTime(lessons: Lesson[]): number {
  // Average reading speed: 200 words per minute
  // Average words per paragraph: 100
  // Add time for quizzes and games

  let totalMinutes = 0;

  lessons.forEach((lesson) => {
    // Reading time for narrative
    const narrativeParagraphs = lesson.narrative.length;
    const readingMinutes = Math.ceil((narrativeParagraphs * 100) / 200);

    // Time for quizzes (30 seconds per question)
    const quizMinutes = Math.ceil((lesson.quizzes.length * 0.5));

    // Time for coach Q&A (1 minute per pair)
    const coachMinutes = lesson.coachQuestions.length;

    // Extra time for interactive games
    const gameTime = lesson.id.endsWith('-game') ? 5 : 0;

    totalMinutes += readingMinutes + quizMinutes + coachMinutes + gameTime;
  });

  return totalMinutes;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}
