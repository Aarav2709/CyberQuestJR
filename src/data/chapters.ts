import { lessons } from './lessons';

export type Chapter = {
  id: string;
  title: string;
  summary: string;
  lessons: string[]; // lesson ids
};

const chapters: Chapter[] = [
  {
    id: 'password-heroes',
    title: 'Password Heroes',
    summary: 'Create strong, unique credentials and adopt a password recipe workflow',
    lessons: ['password-forge', 'password-builder-game'],
  },
  {
    id: 'phishing-detective',
    title: 'Signal Intel Circuit',
    summary: 'Slow-read DMs, decode sketchy links, and coach your friends through pause-first responses',
    lessons: ['signal-triage', 'link-sleuth', 'phishing-detector-game'],
  },
  {
    id: 'digital-footprints',
    title: 'Digital Footprints',
    summary: 'Map your accounts, devices, and privacy defaults so nothing leaks by accident',
    lessons: ['exposure-mapping', 'privacy-audit-game'],
  },
  {
    id: 'privacy-guardian',
    title: 'Privacy Guardian',
    summary: 'Blend footprint logs with rumor-freezing skills to guard reputations and data.',
    lessons: ['exposure-mapping', 'rumor-freeze'],
  },
  {
    id: 'device-shield',
    title: 'Device Shield',
    summary: 'Keep laptops and phones patched, quiet, and boring to attackers',
    lessons: ['device-hygiene', 'device-security-game'],
  },
  {
    id: 'rumor-command',
    title: 'Rumor Command Deck',
    summary: 'Freeze drama, trace sources, and publish calm updates that protect your crew',
    lessons: ['rumor-freeze', 'rumor-tracker-game'],
  },
  {
    id: 'calm-comms',
    title: 'Calm Comms Circle',
    summary: 'Turn chaos into clean briefings with rumor logs and adult-ready updates.',
    lessons: ['rumor-freeze', 'breach-briefing'],
  },
  {
    id: 'ops-playbook',
    title: 'Ops Playbook Run',
    summary: 'Write repeatable runbooks and rehearse incident roles with your team.',
    lessons: ['playbook-weaver', 'incident-sprint'],
  },
  {
    id: 'final-boss',
    title: 'Final Boss Challenge',
    summary: 'A capstone simulation that combines incident response with clean communications.',
    lessons: ['incident-sprint', 'playbook-weaver', 'breach-briefing'],
  },
  {
    id: 'briefing-ops',
    title: 'Briefing Ops',
    summary: 'Practice calm updates after leaks and lead respectful debriefs.',
    lessons: ['breach-briefing'],
  },
  {
    id: 'footprint-forensics',
    title: 'Footprint Forensics Lab',
    summary: 'Audit your digital presence, remove old accounts, and lock down privacy settings across platforms.',
    lessons: ['social-media-audit', 'exposure-mapping'],
  },
  {
    id: 'authentication-fortress',
    title: 'Authentication Fortress',
    summary: 'Master two-factor authentication with apps, hardware keys, and backup strategies',
    lessons: ['two-factor-mastery', 'password-forge', '2fa-setup-game'],
  },
];

export default chapters;

export function findLessonById(id: string) {
  return lessons.find((l) => l.id === id) || null;
}
