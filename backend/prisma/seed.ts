import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Chapter and lesson data matching the frontend structure
const chapters = [
  {
    id: 'password-heroes',
    title: 'Password Heroes',
    summary: 'Create strong, unique credentials and adopt a password recipe workflow',
    sortOrder: 1,
    lessons: ['password-forge', 'password-builder-game'],
  },
  {
    id: 'phishing-detective',
    title: 'Signal Intel Circuit',
    summary: 'Slow-read DMs, decode sketchy links, and coach your friends through pause-first responses',
    sortOrder: 2,
    lessons: ['signal-triage', 'link-sleuth', 'phishing-detector-game'],
  },
  {
    id: 'digital-footprints',
    title: 'Digital Footprints',
    summary: 'Map your accounts, devices, and privacy defaults so nothing leaks by accident',
    sortOrder: 3,
    lessons: ['exposure-mapping', 'privacy-audit-game'],
  },
  {
    id: 'privacy-guardian',
    title: 'Privacy Guardian',
    summary: 'Blend footprint logs with rumor-freezing skills to guard reputations and data.',
    sortOrder: 4,
    lessons: ['exposure-mapping', 'rumor-freeze'],
  },
  {
    id: 'device-shield',
    title: 'Device Shield',
    summary: 'Keep laptops and phones patched, quiet, and boring to attackers',
    sortOrder: 5,
    lessons: ['device-hygiene', 'device-security-game'],
  },
  {
    id: 'rumor-command',
    title: 'Rumor Command Deck',
    summary: 'Freeze drama, trace sources, and publish calm updates that protect your crew',
    sortOrder: 6,
    lessons: ['rumor-freeze', 'rumor-tracker-game'],
  },
  {
    id: 'calm-comms',
    title: 'Calm Comms Circle',
    summary: 'Turn chaos into clean briefings with rumor logs and adult-ready updates.',
    sortOrder: 7,
    lessons: ['rumor-freeze', 'breach-briefing'],
  },
  {
    id: 'ops-playbook',
    title: 'Ops Playbook Run',
    summary: 'Write repeatable runbooks and rehearse incident roles with your team.',
    sortOrder: 8,
    lessons: ['playbook-weaver', 'incident-sprint'],
  },
  {
    id: 'final-boss',
    title: 'Final Boss Challenge',
    summary: 'A capstone simulation that combines incident response with clean communications.',
    sortOrder: 9,
    lessons: ['incident-sprint', 'playbook-weaver', 'breach-briefing'],
  },
  {
    id: 'briefing-ops',
    title: 'Briefing Ops',
    summary: 'Practice calm updates after leaks and lead respectful debriefs.',
    sortOrder: 10,
    lessons: ['breach-briefing'],
  },
  {
    id: 'footprint-forensics',
    title: 'Footprint Forensics Lab',
    summary: 'Audit your digital presence, remove old accounts, and lock down privacy settings across platforms.',
    sortOrder: 11,
    lessons: ['social-media-audit', 'exposure-mapping'],
  },
  {
    id: 'authentication-fortress',
    title: 'Authentication Fortress',
    summary: 'Master two-factor authentication with apps, hardware keys, and backup strategies',
    sortOrder: 12,
    lessons: ['two-factor-mastery', 'password-forge', '2fa-setup-game'],
  },
];

// Lesson definitions
const lessons = [
  { id: 'password-forge', chapterId: 'password-heroes', title: 'Password Forge Lab', focus: 'building layered phrases that survive leaks', difficulty: 'applied', summary: 'You rebuild every password using passphrases, unique salts, and a notebook system.', sortOrder: 1 },
  { id: 'password-builder-game', chapterId: 'password-heroes', title: 'Password Builder Game', focus: 'interactive password building', difficulty: 'foundation', summary: 'Build and test passwords in an interactive environment.', sortOrder: 2 },
  { id: 'signal-triage', chapterId: 'phishing-detective', title: 'Signal Triage Studio', focus: 'recognizing social engineering cues', difficulty: 'foundation', summary: 'Learn to read tone, timing, and digital footprints before trusting a request.', sortOrder: 1 },
  { id: 'link-sleuth', chapterId: 'phishing-detective', title: 'Link Sleuth', focus: 'decoding suspicious links', difficulty: 'applied', summary: 'Analyze URLs and identify phishing attempts.', sortOrder: 2 },
  { id: 'phishing-detector-game', chapterId: 'phishing-detective', title: 'Phishing Detector Game', focus: 'identifying phishing in practice', difficulty: 'foundation', summary: 'Test your phishing detection skills.', sortOrder: 3 },
  { id: 'exposure-mapping', chapterId: 'digital-footprints', title: 'Exposure Mapping', focus: 'auditing digital presence', difficulty: 'applied', summary: 'Map your accounts, devices, and privacy defaults.', sortOrder: 1 },
  { id: 'privacy-audit-game', chapterId: 'digital-footprints', title: 'Privacy Audit Game', focus: 'interactive privacy checking', difficulty: 'foundation', summary: 'Audit your privacy settings interactively.', sortOrder: 2 },
  { id: 'rumor-freeze', chapterId: 'rumor-command', title: 'Rumor Freeze', focus: 'stopping misinformation spread', difficulty: 'applied', summary: 'Freeze drama, trace sources, and protect reputations.', sortOrder: 1 },
  { id: 'rumor-tracker-game', chapterId: 'rumor-command', title: 'Rumor Tracker Game', focus: 'tracking information sources', difficulty: 'foundation', summary: 'Track and verify information sources.', sortOrder: 2 },
  { id: 'device-hygiene', chapterId: 'device-shield', title: 'Device Hygiene', focus: 'maintaining device security', difficulty: 'foundation', summary: 'Keep devices patched and secure.', sortOrder: 1 },
  { id: 'device-security-game', chapterId: 'device-shield', title: 'Device Security Game', focus: 'interactive device security', difficulty: 'foundation', summary: 'Practice device security measures.', sortOrder: 2 },
  { id: 'breach-briefing', chapterId: 'briefing-ops', title: 'Breach Briefing', focus: 'incident communication', difficulty: 'advanced', summary: 'Practice calm updates after security incidents.', sortOrder: 1 },
  { id: 'playbook-weaver', chapterId: 'ops-playbook', title: 'Playbook Weaver', focus: 'creating security runbooks', difficulty: 'advanced', summary: 'Write repeatable security runbooks.', sortOrder: 1 },
  { id: 'incident-sprint', chapterId: 'ops-playbook', title: 'Incident Sprint', focus: 'incident response practice', difficulty: 'advanced', summary: 'Rehearse incident response roles.', sortOrder: 2 },
  { id: 'social-media-audit', chapterId: 'footprint-forensics', title: 'Social Media Audit', focus: 'auditing social media presence', difficulty: 'applied', summary: 'Audit and clean up social media accounts.', sortOrder: 1 },
  { id: 'two-factor-mastery', chapterId: 'authentication-fortress', title: 'Two-Factor Mastery', focus: 'mastering 2FA', difficulty: 'applied', summary: 'Master two-factor authentication methods.', sortOrder: 1 },
  { id: '2fa-setup-game', chapterId: 'authentication-fortress', title: '2FA Setup Game', focus: 'interactive 2FA setup', difficulty: 'foundation', summary: 'Practice setting up two-factor authentication.', sortOrder: 2 },
];

// Badge definitions
const badges = [
  {
    slug: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    iconKey: 'footprints',
    category: 'progress',
    xpReward: 25,
    criteria: { lessonsCompleted: 1 },
    sortOrder: 1,
  },
  {
    slug: 'password-apprentice',
    name: 'Password Apprentice',
    description: 'Complete the Password Heroes chapter',
    iconKey: 'key',
    category: 'progress',
    xpReward: 50,
    criteria: { chaptersCompleted: 1 },
    sortOrder: 2,
  },
  {
    slug: 'quiz-whiz',
    name: 'Quiz Whiz',
    description: 'Answer 10 quizzes correctly on first try',
    iconKey: 'brain',
    category: 'quiz',
    xpReward: 75,
    criteria: { perfectQuizzes: 10 },
    sortOrder: 3,
  },
  {
    slug: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    iconKey: 'flame',
    category: 'streak',
    xpReward: 100,
    criteria: { streakDays: 7 },
    sortOrder: 4,
  },
  {
    slug: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 5 lessons',
    iconKey: 'book-open',
    category: 'progress',
    xpReward: 50,
    criteria: { lessonsCompleted: 5 },
    sortOrder: 5,
  },
  {
    slug: 'chapter-champion',
    name: 'Chapter Champion',
    description: 'Complete 3 chapters',
    iconKey: 'trophy',
    category: 'progress',
    xpReward: 150,
    criteria: { chaptersCompleted: 3 },
    sortOrder: 6,
  },
  {
    slug: 'xp-milestone-500',
    name: 'Rising Star',
    description: 'Earn 500 XP',
    iconKey: 'star',
    category: 'special',
    xpReward: 50,
    criteria: { totalXp: 500 },
    sortOrder: 7,
  },
  {
    slug: 'xp-milestone-1000',
    name: 'Cyber Guardian',
    description: 'Earn 1000 XP',
    iconKey: 'shield',
    category: 'special',
    xpReward: 100,
    criteria: { totalXp: 1000 },
    sortOrder: 8,
  },
  {
    slug: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day learning streak',
    iconKey: 'calendar',
    category: 'streak',
    xpReward: 250,
    criteria: { streakDays: 30 },
    sortOrder: 9,
  },
  {
    slug: 'perfectionist',
    name: 'Perfectionist',
    description: 'Answer 50 quizzes correctly on first try',
    iconKey: 'target',
    category: 'quiz',
    xpReward: 200,
    criteria: { perfectQuizzes: 50 },
    sortOrder: 10,
  },
  {
    slug: 'course-complete',
    name: 'Cyber Expert',
    description: 'Complete all chapters',
    iconKey: 'award',
    category: 'special',
    xpReward: 500,
    criteria: { chaptersCompleted: 12 },
    sortOrder: 11,
  },
];

async function main() {
  console.log('Seeding database...');

  // Seed chapters
  console.log('Seeding chapters...');
  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { id: chapter.id },
      update: {
        title: chapter.title,
        summary: chapter.summary,
        sortOrder: chapter.sortOrder,
      },
      create: {
        id: chapter.id,
        title: chapter.title,
        summary: chapter.summary,
        sortOrder: chapter.sortOrder,
      },
    });
  }

  // Seed lessons
  console.log('Seeding lessons...');
  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        chapterId: lesson.chapterId,
        title: lesson.title,
        focus: lesson.focus,
        difficulty: lesson.difficulty,
        summary: lesson.summary,
        sortOrder: lesson.sortOrder,
      },
      create: {
        id: lesson.id,
        chapterId: lesson.chapterId,
        title: lesson.title,
        focus: lesson.focus,
        difficulty: lesson.difficulty,
        summary: lesson.summary,
        sortOrder: lesson.sortOrder,
      },
    });
  }

  // Seed badges
  console.log('Seeding badges...');
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
        category: badge.category,
        xpReward: badge.xpReward,
        criteria: JSON.stringify(badge.criteria),
        sortOrder: badge.sortOrder,
      },
      create: {
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
        category: badge.category,
        xpReward: badge.xpReward,
        criteria: JSON.stringify(badge.criteria),
        sortOrder: badge.sortOrder,
      },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
