export type Lesson = {
  id: string;
  title: string;
  focus: string;
  difficulty: 'foundation' | 'applied' | 'advanced';
  summary: string;
  outcomes: string[];
  narrative: string[];
  mission: string;
  quizzes: LessonQuiz[];
  coachQuestions: {
    question: string;
    answer: string;
  }[];
};

export type LessonQuiz = {
  question: string;
  options: string[];
  answer: string;
  rationale: string;
};

export const lessons: Lesson[] = [
  {
    id: 'signal-triage',
    title: 'Signal Triage Studio',
    focus: 'recognizing social engineering cues in real conversations',
    difficulty: 'foundation',
    summary:
      'You moderate a group chat where a stranger tries to pressure classmates into sharing their login. Learn to read tone, timing, and digital footprints before trusting a request.',
    outcomes: [
      'Slow down when someone rushes you',
      'Verify the sender through a second channel',
      'Document and report attempts instead of replying in anger',
    ],
    narrative: [
      'Teen attackers rarely brag about malware. They exploit FOMO, friendly slang, and group pressure. When you read a thread, note who introduced the topic, who benefits, and whether the tone shifts once personal data is mentioned.',
      'By annotating each message with an intent label, you transform gossip into evidence. That mindset keeps you safer on every platform because you always ask what the sender gains.',
      'Screenshots act like time machines. Snap the original message, the profile photo, and any reactions. Later you can prove exactly what was said even if the attacker deletes their trail.',
      'Triage means sorting. Drop harmless memes in one stack and suspicious prompts in another. Once you practice sorting daily, your brain spots weird phrasing instantly.',
      'Build a mini evidence board in your notebook. List sender, timestamp, goal, and pressure tactic. Seeing patterns on paper makes the next weird DM easier to label.',
    ],
    mission:
      'Tag three risk indicators inside any message thread you read this week. Screenshot, annotate, and archive them in your personal threat journal so you can brief your friends later.',
    quizzes: [
      {
        question: 'A message claims the principal needs student logins within five minutes to unlock a new wifi tier. What is the strongest first response?',
        options: [
          'Share the login and change it later',
          'Ignore it because principals never text students',
          'Verify the request through the school portal or office before replying',
          'Ask classmates whether they already shared their passwords',
        ],
        answer: 'Verify the request through the school portal or office before replying',
        rationale:
          'Legitimate staff already have access channels. Independent verification stops the attack without feeding it more data.',
      },
      {
        question: 'A stranger switches from casual slang to urgent commands mid-thread. What label should you add to your evidence board?',
        options: [
          'Humor shift',
          'Authority hijack',
          'Emoji spam',
          'Grammar fail'
        ],
        answer: 'Authority hijack',
        rationale: 'Attackers often pretend to outrank you to speed up compliance. Labeling the tactic keeps you from reacting emotionally.',
      },
      {
        question: 'Which combination proves you actually verified a suspicious request?',
        options: [
          'Screenshot + DM reply',
          'Voice memo + group chat alert',
          'Second-channel confirmation + timestamped note',
          'Emoji reaction + sticker reply'
        ],
        answer: 'Second-channel confirmation + timestamped note',
        rationale: 'When you log how and when you verified, adults can trust your timeline and take action quickly.',
      },
      {
        question: 'Why should you avoid replying “stop scamming” inside the same thread?',
        options: [
          'It wastes your sarcasm',
          'It makes the chat messy',
          'It tips off the attacker and may escalate drama',
          'The platform will ban you'
        ],
        answer: 'It tips off the attacker and may escalate drama',
        rationale: 'Silently collecting proof protects your classmates and keeps the attacker from mutating tactics mid-investigation.',
      }
    ],
    coachQuestions: [
      {
        question: 'What are three “slow down” signals hiding inside a rushed DM?',
        answer: 'Look for countdown timers, guilt trips, or surprise rewards that magically appear if you reply within minutes.',
      },
      {
        question: 'How can you verify a sender without replying to the suspicious message?',
        answer: 'Use a different app, school portal, or in-person chat. If the request is real, the adult will already know what they sent.',
      },
      {
        question: 'Why should you archive screenshots instead of dragging drama back into the chat?',
        answer: 'Receipts help trusted adults take action. Public callouts often tip off attackers and make them hide faster.',
      },
    ],
  },
  {
    id: 'password-forge',
    title: 'Password Forge Lab',
    focus: 'building layered phrases that survive leaks',
    difficulty: 'applied',
    summary:
      'You rebuild every password using passphrases, unique salts, and a notebook system that still works when managers fail.',
    outcomes: [
      'Stack memories into passphrase blocks',
      'Salt each account with context words',
      'Audit reuse every quarter',
    ],
    narrative: [
      'Complexity is less about symbols and more about structure. A memorable passphrase like "orbit campus film lantern" already beats short strings. Adding a site specific tag such as "-astroTik" means a TikTok breach never touches your streaming account.',
      'Write the blueprint, not the password. A secure notebook might say: "music: orbit campus film lantern + brass". Only you know that brass equals !Br55. Even if someone finds the notebook, they still lack the final mapping.',
      'Reuse creeps in when you rush. Keep a tiny checklist by your keyboard: recipe, salt, confirm. Once you tick those boxes, you never accidentally copy-paste an old favorite.',
      'Reward yourself after rotations. Pair password nights with snacks or music, and suddenly updates feel like part of your routine instead of a panic chore.',
      'Document your “ingredient list” the same way bakers jot down ratios. When you return months later, the shorthand instantly reminds you which symbol pack belongs to which site.',
    ],
    mission:
      'Refactor three passwords tonight. Record the recipe, not the final string, and schedule a reminder every ninety days to rotate your salts.',
    quizzes: [
      {
        question:
          'Which recipe gives the strongest defense while staying memorable for a streaming service named NovaPlay?',
        options: [
          'Nova1234!?',
          'orbit-campus-lantern-novaPlay',
          'OrbitCampusLantern!2024',
          'orbit campus lantern - nova + brass riff',
        ],
        answer: 'orbit campus lantern - nova + brass riff',
        rationale:
          'Recipes describing the transformation are safer than exposed passwords and encourage site specific salt.',
      },
      {
        question: 'You forgot a symbol in your new passphrase. What is the safest fix?',
        options: [
          'Add the symbol to every password immediately',
          'Append the same symbol to all accounts next month',
          'Add the symbol only to the account you are editing now',
          'Ignore it as long as the password is long'
        ],
        answer: 'Add the symbol only to the account you are editing now',
        rationale: 'Each account deserves its own unique salt; copying the fix everywhere rebuilds the reuse problem.',
      },
      {
        question: 'Which storage method keeps your handwritten recipe notes safe if someone takes a photo?',
        options: [
          'Write full passwords but hide the notebook',
          'Use symbols like “+sunset riff” that only you can decode',
          'Store all recipes in your phone gallery',
          'Memorize everything and never write it down'
        ],
        answer: 'Use symbols like “+sunset riff” that only you can decode',
        rationale: 'Layered hints are useless to intruders yet instantly meaningful to you.',
      },
      {
        question: 'How often should you run a reuse audit on high-value accounts?',
        options: ['Once a year', 'Whenever you get bored', 'Every season or after any breach alert', 'Never if you use symbols'],
        answer: 'Every season or after any breach alert',
        rationale: 'Quarterly reviews keep leaks from spreading and teach you to react to breach emails calmly.',
      },
    ],
    coachQuestions: [
      {
        question: 'What makes a passphrase “sticky” for your brain?',
        answer: 'Use five to six short words from hobbies, mix upper and lower case naturally, then tag on a site-specific twist.',
      },
      {
        question: 'How does a password recipe stay safe even if someone finds your notes?',
        answer: 'You only write the instructions, not the finished result. Without your secret mapping, the notebook is useless to attackers.',
      },
      {
        question: 'Why should you schedule password rotations every season?',
        answer: 'Regular check-ins catch reuse early, and reminders stop surprise breaches from spreading to every account.',
      },
    ],
  },
  {
    id: 'exposure-mapping',
    title: 'Exposure Mapping Studio',
    focus: 'tracking digital footprint and privacy defaults',
    difficulty: 'applied',
    summary:
      'You map every account, the data it collects, and who can view it so you can close leaks fast.',
    outcomes: [
      'Inventory every account linked to your main email',
      'Score each account by visibility and sensitivity',
      'Use automation to export or delete data',
    ],
    narrative: [
      'Footprints leak most during transitions. Before you switch schools or jobs, export your apps, delete unused profiles, and rotate security questions. A neat inventory helps you respond to future breaches within minutes.',
      'Treat privacy settings as living homework. Each platform pushes new sharing defaults several times a year. Schedule a ten minute audit every month to lock them back down.',
      'Color code your map. Use bright tones for public accounts, cool blues for private spaces, and grays for archived pages. Visual cues show which areas need attention first.',
      'Look beyond apps. Gaming usernames, smart home devices, and online forms all leak clues. If it connects to the internet, it belongs on your footprint grid.',
      'Note which apps ask for microphone, camera, or location access. Those toggles quietly turn on again after updates, so your log reminds you to revisit them.',
    ],
    mission:
      'Build a footprint map with three columns: platform, data exposed, control action. Review it with a mentor and mark the biggest surprise.',
    quizzes: [
      {
        question: 'Which practice reduces exposure the fastest after discovering an old public blog account?',
        options: [
          'Change the theme to make it look new',
          'Post a note telling people not to read it',
          'Delete every post manually over time',
          'Export the data, deactivate the account, and confirm removal in search results',
        ],
        answer: 'Export the data, deactivate the account, and confirm removal in search results',
        rationale:
          'Taking the account offline plus confirming the change removes both the content and its search trail.',
      },
      {
        question: 'You notice an app requesting microphone access for no reason. What belongs in your footprint log?',
        options: ['Date and time only', 'Permission type, reason, and whether you revoked it', 'A selfie proving you denied it', 'Nothing; it is normal'],
        answer: 'Permission type, reason, and whether you revoked it',
        rationale: 'Detailed notes help you audit faster next month and catch patterns across apps.',
      },
      {
        question: 'Which order closes leaks efficiently after a phone upgrade?',
        options: [
          'Sell the old phone, then wipe it',
          'Wipe the old device, remove accounts, then sell or recycle it',
          'Factory reset, but keep SIM card installed',
          'Throw it in a drawer without changes'
        ],
        answer: 'Wipe the old device, remove accounts, then sell or recycle it',
        rationale: 'Cleaning data before transfer prevents strangers from restoring your credentials later.',
      },
      {
        question: 'A friend shares a spreadsheet of everyone’s gamer tags and emails. What is the privacy-friendly response?',
        options: [
          'Forward it widely so people know',
          'Ask them to lock the sheet and remove emails, then share safer contact methods',
          'Ignore it because it is only gaming info',
          'Copy the sheet to your own drive'
        ],
        answer: 'Ask them to lock the sheet and remove emails, then share safer contact methods',
        rationale: 'Reducing unnecessary exposure keeps contact info from being scraped by strangers.',
      },
    ],
    coachQuestions: [
      {
        question: 'What is the first step when an app refuses to delete your data?',
        answer: 'Export your info, then contact support with screenshots of the request so you have proof of the timeline.',
      },
      {
        question: 'How often should you review privacy settings, and why so frequently?',
        answer: 'Set a monthly reminder. Platforms quietly reset toggles during updates, so consistent check-ins keep things locked.',
      },
      {
        question: 'Why include devices like smart speakers on your footprint map?',
        answer: 'They collect voice snippets and routines. Knowing they exist helps you mute mics or clear logs when needed.',
      },
    ],
  },
  {
    id: 'incident-sprint',
    title: 'Incident Sprint Deck',
    focus: 'responding to leaks and reporting without panic',
    difficulty: 'advanced',
    summary:
      'You lead a response table where a classmate clicks a malicious link. Learn how to slow the blast radius and brief adults with facts.',
    outcomes: [
      'Capture screenshots and timestamps',
      'Isolate the affected device or account',
      'Escalate with clear language and next steps',
    ],
    narrative: [
      'During a real incident, energy spikes and rumors explode. Your influence comes from calm notes. Write down who saw what and when. That log lets pros rebuild the timeline later.',
      'Reporting is not snitching. You protect everyone when you escalate early. Provide signal, not drama.',
      'Create a “calm script” ahead of time. It might sound like: “I spotted a suspicious link at 3:02 PM from user @nebula. Here are screenshots. I already logged out.” Practicing that tone keeps your brain focused.',
      'Plan recovery steps before anything breaks. Know how to reset passwords, scan devices, and inform guardians. Preparation shrinks fear.',
      'Schedule a debrief practice with friends. Role-play who gathers evidence, who isolates devices, and who updates adults. Drills shrink panic.',
    ],
    mission:
      'Draft an incident card: trigger, immediate actions, escalation contacts, and debrief questions. Store it with your school emergency info.',
    quizzes: [
      {
        question: 'After capturing screenshots of a phishing DM, what should happen before rejoining the chat?',
        options: [
          'Delete the screenshots to save storage',
          'Share the attacker profile publicly to warn others',
          'Isolate the device or account, then brief a trusted adult or admin with your log',
          'Ignore the event because nothing was lost yet',
        ],
        answer: 'Isolate the device or account, then brief a trusted adult or admin with your log',
        rationale:
          'Containment plus escalation protects everyone faster than public callouts.',
      },
      {
        question: 'Which detail matters most in your incident journal entry?',
        options: ['The background color of the chat', 'Exact timestamps and usernames involved', 'How angry you felt', 'Who first posted the rumor'],
        answer: 'Exact timestamps and usernames involved',
        rationale: 'Time-stamped facts help pros rebuild the chain of events without guessing.',
      },
      {
        question: 'A friend wants to announce the breach on social media. What should you advise?',
        options: [
          'Post immediately to be transparent',
          'Wait until adults give a signal so attackers do not adapt',
          'Never tell anyone',
          'Change all passwords first, then post'
        ],
        answer: 'Wait until adults give a signal so attackers do not adapt',
        rationale: 'Coordinated messaging prevents attackers from learning what evidence you have.',
      },
      {
        question: 'Why is a debrief important even when nothing was stolen?',
        options: [
          'It lets you blame someone',
          'It updates the rumor mill',
          'It teaches your team what worked and what to improve next time',
          'It helps you delete logs faster'
        ],
        answer: 'It teaches your team what worked and what to improve next time',
        rationale: 'Reflection locks in skills so the next incident feels manageable.',
      },
    ],
    coachQuestions: [
      {
        question: 'What two actions happen before you tell the story to everyone else?',
        answer: 'Isolate the device (airplane mode, log out) and capture evidence with timestamps so experts can investigate.',
      },
      {
        question: 'How do you decide who to escalate to?',
        answer: 'Use your incident card. Start with a trusted adult, counselor, or coach who can reach tech staff quickly.',
      },
      {
        question: 'Why is a debrief important even if nothing was stolen?',
        answer: 'Reviewing the response teaches your circle what worked and what to adjust next time, which builds resilience.',
      },
    ],
  },
  {
    id: 'device-hygiene',
    title: 'Device Hygiene Lab',
    focus: 'hardening laptops and phones before threats show up',
    difficulty: 'applied',
    summary:
      'You host a fifteen-minute maintenance party each week: patching apps, clearing shady extensions, and auditing permissions so attackers find nothing to exploit.',
    outcomes: [
      'Stack OS, browser, and app updates into one ritual',
      'Log every permission you approve so you can revoke it later',
      'Back up critical files before running deep cleanups',
    ],
    narrative: [
      'Updates fail when you treat them like chores. Instead, create a vibe: headphones on, snack ready, timer set to fifteen minutes. You patch the OS, browser, and messaging apps back-to-back, so nothing lags behind.',
      'When you audit permissions, imagine you are a detective. Open each app’s settings and ask, “Does this tool really need my camera or GPS today?” If the answer feels fuzzy, toggle it off and note the change in your log.',
      'Battery drains and random pop-ups are gossip from your device. They hint at rogue extensions or background apps mining data. Quarantine anything suspicious, then research it calmly instead of doom-scrolling rumors.',
      'Backups sound dramatic, but they are just safety nets. A weekly copy to cloud or an encrypted drive means you can wipe a device without losing your creative files, game saves, or homework drafts.',
      'Document every tweak. A quick note that says “Saturday: removed sketchy keyboard app, revoked location for three games” becomes proof that you ran hygiene steps if an adult asks later.',
    ],
    mission:
      'Run a fifteen-minute hygiene sprint tonight: update your OS, delete one unused app, revoke at least two permissions, and jot the results in a maintenance log.',
    quizzes: [
      {
        question: 'Which order keeps a hygiene sprint efficient and safe?',
        options: [
          'Delete apps first, then worry about backups later',
          'Back up files, update the OS, then patch apps and browser extensions',
          'Toggle random permissions off without reviewing them',
          'Ignore updates until a device crashes',
        ],
        answer: 'Back up files, update the OS, then patch apps and browser extensions',
        rationale: 'Protect data before changing anything, then patch layers from system to apps so nothing is missed.',
      },
      {
        question: 'An unknown keyboard app suddenly asks for microphone access. What is the best move?',
        options: [
          'Allow it and hope for the best',
          'Disable or uninstall the app, then note the change in your log',
          'Mute your phone volume only',
          'Restart the phone without touching settings',
        ],
        answer: 'Disable or uninstall the app, then note the change in your log',
        rationale: 'Removing the risky component and documenting the decision prevents the permission from sneaking back later.',
      },
      {
        question: 'How can you tell if a browser extension deserves removal?',
        options: [
          'It has a colorful icon',
          'It duplicates a feature the browser already has and recently started showing ads',
          'It was installed last year',
          'Your friend still uses it',
        ],
        answer: 'It duplicates a feature the browser already has and recently started showing ads',
        rationale: 'Redundant extensions with new ad behavior often siphon data—remove them before they update again.',
      },
      {
        question: 'Why keep a written hygiene log?',
        options: [
          'So you can brag online',
          'Logs help you prove maintenance happened and spot patterns like recurring malware',
          'Teachers require it',
          'It replaces antivirus software',
        ],
        answer: 'Logs help you prove maintenance happened and spot patterns like recurring malware',
        rationale: 'Paper trails build confidence, especially if you ever need help from tech support or parents.',
      },
    ],
    coachQuestions: [
      {
        question: 'How do you remember to run hygiene sprints?',
        answer: 'Tie them to an existing habit—Friday playlists or Sunday planning—and set a repeating reminder on your phone.',
      },
      {
        question: 'What counts as evidence that you revoked a risky permission?',
        answer: 'Screenshots or notes that list the app, the permission you toggled, and the date are enough to brief an adult later.',
      },
      {
        question: 'Why should you stage backups before uninstalling things?',
        answer: 'If a cleanup goes sideways, you can restore your files fast instead of panicking about lost homework.',
      },
    ],
  },
  {
    id: 'breach-briefing',
    title: 'Breach Briefing Studio',
    focus: 'writing calm updates during messy incidents',
    difficulty: 'advanced',
    summary:
      'You lead the communications huddle when a club account leaks. Learn to turn raw notes into calm updates adults can act on.',
    outcomes: [
      'Capture timelines with precise timestamps',
      'Draft “status-now” and “next-step” sentences for adults',
      'Host respectful debriefs that turn chaos into lessons',
    ],
    narrative: [
      'Briefings are about signal, not drama. Start with the trigger (“3:14 PM: @nebula clicked a fake invite link”), list containment steps, then end with what help you need.',
      'Tone matters. Use verbs like “isolated,” “reset,” and “pending.” They show you are steady, even if the chat is on fire.',
      'Screenshots need captions. Label each with who, what platform, and why it matters. Adults can review faster when they are not guessing.',
      'Never promise fixes you cannot deliver. Instead, outline options: “Option A: wipe the Chromebook. Option B: swap logins and monitor.”',
      'Close every briefing with a debrief appointment. Reflection keeps the next incident shorter because everyone already knows their role.',
    ],
    mission:
      'Write a two-paragraph micro brief for a fictional leak. Include trigger, actions taken, and the exact question you will ask a trusted adult.',
    quizzes: [
      {
        question: 'Which opener sets the right tone for a live briefing?',
        options: [
          '“OMG everything is broken!”',
          '“3:22 PM: suspicious login detected. Logged out of all sessions and collected screenshots.”',
          '“Who messed up this time?”',
          '“Just chill, it’s probably fine.”',
        ],
        answer: '“3:22 PM: suspicious login detected. Logged out of all sessions and collected screenshots.”',
        rationale: 'Specific timestamps plus actions reassure adults you are already containing the issue.',
      },
      {
        question: 'What belongs in the “ask” section of a briefing?',
        options: [
          'Blame for whoever clicked the link',
          'A meme to lighten the mood',
          'Clear next steps you need approval for, like “Need admin to reset shared drive permissions”',
          'Song recommendations',
        ],
        answer: 'Clear next steps you need approval for, like “Need admin to reset shared drive permissions”',
        rationale: 'Adults respond faster when they know the exact decision or access you require.',
      },
      {
        question: 'Why schedule a debrief even if the breach was tiny?',
        options: [
          'So you can punish someone',
          'Because reflection locks in what worked and what to tweak next time',
          'To post on social media',
          'To stall reporting',
        ],
        answer: 'Because reflection locks in what worked and what to tweak next time',
        rationale: 'Quick debriefs build muscle memory and reduce panic in future incidents.',
      },
      {
        question: 'A teammate keeps adding unverified rumors to your briefing doc. What do you do?',
        options: [
          'Leave them; more info is better',
          'Delete the doc',
          'Label a “rumors” section clearly or move the notes elsewhere so the official brief stays factual',
          'Send the doc unfinished',
        ],
        answer: 'Label a “rumors” section clearly or move the notes elsewhere so the official brief stays factual',
        rationale: 'Separating facts from speculation keeps the briefing trustworthy without silencing helpers.',
      },
    ],
    coachQuestions: [
      {
        question: 'How do you keep your voice calm when presenting?',
        answer: 'Write a short script with bullet points and practice once out loud before dialing adults or teachers.',
      },
      {
        question: 'What if you discover new info mid-brief?',
        answer: 'Acknowledge it, mark it as preliminary, and promise a follow-up summary once confirmed.',
      },
      {
        question: 'How do you make sure every teammate feels heard afterward?',
        answer: 'Use your debrief to ask what felt stressful, what felt smooth, and capture those notes for the next playbook.',
      },
    ],
  },
  {
    id: 'link-sleuth',
    title: 'Link Sleuth Workshop',
    focus: 'dissecting mysterious invites before tapping them',
    difficulty: 'foundation',
    summary:
      'You slow scroll every invite, preview links in plain text, and log who asked you to click so nothing surprises you mid-semester.',
    outcomes: [
      'Decode shortened URLs and lookalike domains',
      'Check the context of an invite before trusting it',
      'Archive proof so adults can shut fakes down fast',
    ],
    narrative: [
      'Short links feel urgent because they hide everything. Copy them into a plain-text note first. If the domain mutates from “homework.school” to “home-work.help,” you just caught the trick without leaving your notebook.',
      'Scammers reuse fonts, colors, and even typos. Build a swipe file: screenshot every weird invite and write what gave it away. When the same font shows up in another chat, you already know it is a rerun.',
      'Always check who actually sent the message. If a doc arrives in a group chat, scroll up to see who added it. If a “teacher” drops it in a DM but never says your name, assume it is a clone until proven legit.',
      'Preview the link in multiple ways. Hover to reveal the URL, paste it into a sandbox browser, and read the SSL certificate name. Those extra seconds keep malware off your main device.',
      'Log every click request in your “link ledger.” Columns: sender, promise, deadline, and what you discovered. When a trusted adult asks for proof, you have a mini case file ready.',
    ],
    mission:
      'Collect three suspicious invites this week. For each one, decode the URL, identify the persuasion tactic, and write a one-sentence verdict in your link ledger.',
    quizzes: [
      {
        question: 'A classmate forwards a bit.ly link claiming to be a scholarship form. What is the safest first move?',
        options: [
          'Click quickly before the deadline vanishes',
          'Paste the link into a sandbox or expander to reveal the full domain',
          'Ask everyone else if they already filled it out',
          'Flag the message as spam without checking',
        ],
        answer: 'Paste the link into a sandbox or expander to reveal the full domain',
        rationale: 'Seeing the full URL exposes impostor domains without loading them on your main device.',
      },
      {
        question: 'Which clue signals that “schoolupdates.education-login.com” is shady?',
        options: [
          'It uses HTTPS',
          'The subdomain piles multiple words before the main domain',
          'It mentions education',
          'It has a hyphen',
        ],
        answer: 'The subdomain piles multiple words before the main domain',
        rationale: 'Attackers often stuff official-sounding terms before a completely unrelated root domain.',
      },
      {
        question: 'Why keep a “link ledger” even if you delete the messages later?',
        options: [
          'Ledgers are trendy',
          'You can reuse the invites',
          'Logs prove patterns and help adults escalate faster',
          'It replaces antivirus',
        ],
        answer: 'Logs prove patterns and help adults escalate faster',
        rationale: 'Written evidence shows repetition, which convinces admins to block the source.',
      },
      {
        question: 'A QR code poster appears in the cafeteria overnight. What belongs in your notebook before scanning?',
        options: [
          'Photo of the poster, location, and who benefits from the request',
          'Only the QR code itself',
          'How excited you feel',
          'Nothing; just scan it',
        ],
        answer: 'Photo of the poster, location, and who benefits from the request',
        rationale: 'Context clues plus a visual record help you trace where the code came from and whether to report it.',
      },
    ],
    coachQuestions: [
      {
        question: 'When should you forward a suspicious link to an adult?',
        answer: 'As soon as the sender pressures you or the domain looks off. Attach your screenshots and the decoded URL.',
      },
      {
        question: 'How do you expand a short link without loading it directly?',
        answer: 'Use an online expander or paste it into a notes app that shows the resolved URL before you click.',
      },
      {
        question: 'What if the invite is legit after all?',
        answer: 'Great—log what you verified so next time you can confirm faster. Caution is never wasted.',
      },
    ],
  },
  {
    id: 'rumor-freeze',
    title: 'Rumor Freeze Lab',
    focus: 'cooling drama, tracing sources, and writing calm updates',
    difficulty: 'applied',
    summary:
      'You take chaotic group chats and convert them into timelines, so rumors stop and facts stay center stage.',
    outcomes: [
      'Separate feelings from verifiable facts',
      'Track who introduced each claim',
      'Publish calm updates that slow the gossip loop',
    ],
    narrative: [
      'Rumors spread because they feel fast. Your job is to add friction. Ask, “Who saw this first?” and “What do we actually know?” Writing those two questions at the top of your page keeps you from amplifying noise.',
      'Screenshot everything before people start editing their words. Label each image with the source, timestamp, and whether it is confirmed or speculation. Later you can build a clean timeline.',
      'Create two columns: facts and feelings. Facts get bullet points, feelings get full sentences. This small design choice keeps emotional processing separate from the report you will eventually send.',
      'Draft a freeze message: “Pause on sharing this rumor until we verify it. Here is what we know…” That sentence calms the chat without sounding bossy because you offer clarity and a plan.',
      'Store your timelines in a rumor log. When another situation pops up, reuse the template so your brain remembers how to stay calm under pressure.',
    ],
    mission:
      'Pick a recent rumor (real or fictional) and build a two-column log: facts vs. feelings. Add timestamps and a plan for who to brief.',
    quizzes: [
      {
        question: 'What should be the first line of a “freeze” message in a chaotic chat?',
        options: [
          '“Whoever said this is lying.”',
          '“Pause. Here is what we can confirm so far…”',
          '“Stop talking.”',
          '“LOL calm down.”',
        ],
        answer: '“Pause. Here is what we can confirm so far…”',
        rationale: 'You invite people to slow down while offering verified info, which lowers defensiveness.',
      },
      {
        question: 'Why keep feelings separated from facts in your notes?',
        options: [
          'Feelings never matter',
          'It helps you empathize later but prevents emotional sentences from entering the official report',
          'You can delete feelings faster',
          'It looks cooler',
        ],
        answer: 'It helps you empathize later but prevents emotional sentences from entering the official report',
        rationale: 'Compartmentalizing lets you process emotions without contaminating the factual timeline.',
      },
      {
        question: 'What belongs in the rumor log entry?',
        options: [
          'Only the name of the person being blamed',
          'Timestamps, source screenshots, and action steps',
          'How angry you felt',
          'Memes about the situation',
        ],
        answer: 'Timestamps, source screenshots, and action steps',
        rationale: 'Those details help adults review the situation quickly and fairly.',
      },
      {
        question: 'A friend insists on posting the rumor publicly “to warn people.” What is your response?',
        options: [
          'Let them do it',
          'Ask them to wait until you confirm details with a trusted adult and offer to help craft a factual update',
          'Threaten them',
          'Ignore them',
        ],
        answer: 'Ask them to wait until you confirm details with a trusted adult and offer to help craft a factual update',
        rationale: 'Coordinated messaging prevents misinformation and shows you respect the need for accuracy.',
      },
    ],
    coachQuestions: [
      {
        question: 'How do you decide which adult to brief about a rumor?',
        answer: 'Choose the person closest to the situation (coach, counselor, club lead) so they can respond with context.',
      },
      {
        question: 'What if the rumor turns out to be true?',
        answer: 'Update your timeline with confirmed info, then share the same calm freeze message with the new facts.',
      },
      {
        question: 'How can teammates help keep the chat calm?',
        answer: 'Assign roles: one person collects evidence, another crafts the freeze message, and a third briefs adults.',
      },
    ],
  },
  {
    id: 'playbook-weaver',
    title: 'Playbook Weaver Studio',
    focus: 'building personal security runbooks for home, school, and clubs',
    difficulty: 'advanced',
    summary:
      'You turn everything you have learned into reusable scripts: maintenance checklists, escalation trees, and briefing templates.',
    outcomes: [
      'Draft runbooks for different scenarios',
      'Assign roles and backups for each play',
      'Review and iterate after every exercise',
    ],
    narrative: [
      'A playbook is just a recipe for calm. Start with your trigger: “phone stolen,” “club account locked,” or “weird USB found.” Under each trigger, list the first three moves someone should make even if you are absent.',
      'Use verbs, not paragraphs. “Isolate laptop,” “call guardians,” “reset shared drive.” Short commands travel faster when emotions spike.',
      'Add roles next to every step. If you write “collect screenshots,” say who handles it and who is the backup. Clarity prevents everyone from piling on the same task.',
      'Print or share your playbook in two places: a binder at home and a secure cloud folder. Redundancy keeps the plan reachable during outages.',
      'Schedule review rituals. After each drill or real incident, mark what worked, what lagged, and what questions adults still had. Those notes evolve the playbook into something future-you will trust.',
    ],
    mission:
      'Pick one scenario (lost phone, breached club account, phishing DM) and draft a six-step playbook with roles, tools, and escalation contacts.',
    quizzes: [
      {
        question: 'Which detail turns a “to-do” list into a real playbook?',
        options: [
          'Adding emojis',
          'Assigning roles and backups next to each action',
          'Making it all caps',
          'Hiding it on your desktop',
        ],
        answer: 'Assigning roles and backups next to each action',
        rationale: 'People move faster when they know exactly who owns a task and who steps in if needed.',
      },
      {
        question: 'Why print a copy of the runbook?',
        options: [
          'Paper looks professional',
          'Screens might be locked or offline during an incident',
          'Teachers require it',
          'It replaces digital backups',
        ],
        answer: 'Screens might be locked or offline during an incident',
        rationale: 'Physical copies keep the plan available when devices are compromised.',
      },
      {
        question: 'What belongs in the “review” section of a playbook?',
        options: [
          'A list of snacks',
          'Notes about what slowed you down and the next tweak to make',
          'Everyone’s moods',
          'Memes from the drill',
        ],
        answer: 'Notes about what slowed you down and the next tweak to make',
        rationale: 'Iteration keeps the document useful instead of dusty.',
      },
      {
        question: 'During a drill, someone misses their step. What should the playbook remind you to do?',
        options: [
          'Delete their name',
          'Run the backup assignment and log the gap for the review',
          'Restart the whole drill',
          'Ignore it',
        ],
        answer: 'Run the backup assignment and log the gap for the review',
        rationale: 'Backups keep the play moving, and the review log turns the miss into a lesson.',
      },
    ],
    coachQuestions: [
      {
        question: 'How many steps should a teen-friendly playbook include?',
        answer: 'Aim for five to seven steps—long enough to cover essentials, short enough to remember under stress.',
      },
      {
        question: 'Where do you store contact info for escalation?',
        answer: 'Include a mini directory at the top of the playbook plus an index card in your backpack.',
      },
      {
        question: 'What if someone new joins your team?',
        answer: 'Walk them through the playbook, assign a role, and add their name next to a step so they feel ownership.',
      },
    ],
  },
  {
    id: 'social-media-audit',
    title: 'Social Media Audit Lab',
    focus: 'discovering and securing your digital footprint across platforms',
    difficulty: 'applied',
    summary:
      'Learn to search yourself like a stranger would, find forgotten accounts, and lock down privacy settings before leaks happen.',
    outcomes: [
      'Run a comprehensive search of your own name and email addresses',
      'Identify old profiles and data broker listings',
      'Update privacy settings systematically across all active platforms',
    ],
    narrative: [
      'Most teens have three to five active social media accounts, but many have forgotten profiles from years past still broadcasting personal data. Your digital footprint is the sum of every username, photo tag, comment thread, and location check-in you have ever created.',
      'Start by searching your full name in quotes on Google, Bing, and DuckDuckGo. Note every result on the first three pages. Then search each email address you have ever used. You will find old forum posts, gaming profiles, and tagged photos you forgot existed.',
      'Data brokers collect public records and social media scrapes, then sell profiles to advertisers and background-check services. Sites like Whitepages, Spokeo, and PeopleFinder may already list your address, phone number, and family members. You can request removal, but it takes patience and multiple follow-ups.',
      'Privacy settings change constantly. Platforms redesign menus, introduce new data-sharing defaults, and bury opt-outs deep in settings. Schedule a quarterly audit: open each app, navigate to privacy, and confirm who can see your posts, contact you, and tag you in photos.',
      'Document your audit in a spreadsheet or notebook. List the platform, your username, current privacy level, and the date you last checked. This log becomes your roadmap for future audits and helps you spot when a platform reverts your settings after an update.',
      'Deactivation versus deletion: deactivation hides your profile but preserves your data; deletion removes it permanently after a waiting period. Read the platform policy carefully, export your photos and messages if you want to keep them, then follow the deletion steps exactly. Some platforms require multiple confirmations or waiting periods to prevent accidental deletions.',
      'Location data is the silent leaker. Photos taken with smartphones embed GPS coordinates unless you disable geotagging in camera settings. Check-ins and geotags on posts announce where you live, study, and hang out. Scrub old posts for location clues and disable location services for social media apps unless you truly need them.',
    ],
    mission:
      'Run a full name and email search on yourself this week. Document every result in a notebook, then request removal from at least one data broker site. Report your findings to a trusted adult.',
    quizzes: [
      {
        question: 'What is the difference between deactivating and deleting a social media account?',
        options: [
          'Deactivation is permanent; deletion is reversible',
          'Deactivation hides your profile but keeps data; deletion removes it after a waiting period',
          'They are the same thing with different names',
          'Deletion keeps your data; deactivation removes it'
        ],
        answer: 'Deactivation hides your profile but keeps data; deletion removes it after a waiting period',
        rationale: 'Deactivation is like pressing pause—your account disappears from view but can be reactivated. Deletion requests permanent removal, though platforms often impose a grace period in case you change your mind.',
      },
      {
        question: 'Why should you search your email addresses in addition to your name?',
        options: [
          'Email searches only find spam',
          'Usernames and emails appear in places your name does not, like forum sign-ups',
          'Email search results are more accurate',
          'You can find your passwords this way'
        ],
        answer: 'Usernames and emails appear in places your name does not, like forum sign-ups',
        rationale: 'Many old accounts used your email as the identifier, and forums or comment sections may display it publicly even if your real name is hidden.',
      },
      {
        question: 'How often should you audit your social media privacy settings?',
        options: [
          'Once when you create the account',
          'Every day before posting',
          'Quarterly or after major platform updates',
          'Only when you suspect a breach'
        ],
        answer: 'Quarterly or after major platform updates',
        rationale: 'Platforms change settings frequently. Regular audits ensure new features have not reset your privacy preferences to defaults.',
      },
      {
        question: 'What metadata do smartphone photos usually contain?',
        options: [
          'Your password',
          'GPS coordinates and camera model',
          'Your social security number',
          'Your browsing history'
        ],
        answer: 'GPS coordinates and camera model',
        rationale: 'EXIF metadata embeds location, date, time, and device info in photo files unless you disable geotagging in camera settings.',
      }
    ],
    coachQuestions: [
      {
        question: 'What are three types of forgotten accounts that might still be broadcasting your info?',
        answer: 'Old gaming profiles, forum sign-ups from middle school, and accounts created for one-time contests or giveaways.',
      },
      {
        question: 'How do you request removal from a data broker site?',
        answer: 'Visit their opt-out page, submit your info, and keep a dated screenshot of the confirmation. Follow up after a few weeks to verify removal.',
      },
      {
        question: 'What should you export before deleting an account?',
        answer: 'Photos, messages, contact lists, and any content you want to preserve. Most platforms offer a data download tool in settings.',
      },
    ],
  },
  {
    id: 'two-factor-mastery',
    title: 'Two-Factor Mastery Workshop',
    focus: 'implementing and managing multi-factor authentication across critical accounts',
    difficulty: 'advanced',
    summary:
      'Move beyond SMS codes to authenticator apps, hardware keys, and backup strategies that protect your accounts even if your password leaks.',
    outcomes: [
      'Understand the difference between SMS, app-based, and hardware 2FA',
      'Enable 2FA on email, social media, banking, and school portals',
      'Create and store backup codes securely',
    ],
    narrative: [
      'Two-factor authentication means proving your identity with two different types of evidence: something you know (password) and something you have (phone, app, or hardware key). Even if an attacker guesses your password, they cannot log in without the second factor.',
      'SMS codes are the most common 2FA method, but they are vulnerable to SIM-swapping attacks. An attacker convinces your phone carrier to transfer your number to their device, then intercepts your codes. For high-value accounts like email and banking, use an authenticator app instead.',
      'Authenticator apps like Google Authenticator, Authy, or Microsoft Authenticator generate time-based one-time passwords (TOTPs) that refresh every 30 seconds. They work offline and cannot be intercepted like SMS. Install the app, scan the QR code when enabling 2FA, and the account appears in your app list.',
      'Hardware security keys are physical devices that plug into USB ports or connect via NFC. They provide the strongest protection because an attacker would need to steal the key physically. YubiKeys and Titan Security Keys are popular options for high-risk accounts like admin panels or cryptocurrency wallets.',
      'Backup codes are one-time-use passwords you generate when setting up 2FA. Print them, store them in a safe place, and never share them digitally. If you lose your phone or hardware key, backup codes let you regain access without locking yourself out permanently.',
      'Account recovery is a weak link. Attackers target backup email addresses and security questions to bypass 2FA. Set a strong, unique password for your backup email, enable 2FA on it, and avoid obvious security questions like "mother\'s maiden name." Consider using a password manager to generate nonsense answers you can retrieve later.',
      'Prioritize which accounts need 2FA. Start with your primary email, password manager, banking apps, and any account linked to money or identity documents. Then add social media, gaming, and school portals. The goal is to create layers so losing one account does not cascade into losing everything.',
      'Test your 2FA setup quarterly. Log out, try to log back in, and verify your backup codes still work. Simulate losing your phone by attempting recovery with only your backup codes and recovery email. This drill reveals gaps before an actual emergency.',
    ],
    mission:
      'Enable 2FA on your primary email and at least two other critical accounts this week. Generate backup codes, store them offline, and test logging in with them.',
    quizzes: [
      {
        question: 'Why are authenticator apps more secure than SMS codes?',
        options: [
          'They are faster to type',
          'They cannot be intercepted via SIM-swapping attacks',
          'They work on more devices',
          'They never expire'
        ],
        answer: 'They cannot be intercepted via SIM-swapping attacks',
        rationale: 'Authenticator apps generate codes locally on your device, so attackers cannot hijack your phone number to steal them.',
      },
      {
        question: 'What should you do with backup codes after generating them?',
        options: [
          'Email them to yourself for easy access',
          'Print them and store them in a safe offline location',
          'Share them with a trusted friend',
          'Save them in a cloud note'
        ],
        answer: 'Print them and store them in a safe offline location',
        rationale: 'Backup codes are your last line of defense. Storing them offline prevents attackers from accessing them if they compromise your digital accounts.',
      },
      {
        question: 'Which type of 2FA offers the strongest protection?',
        options: [
          'SMS codes',
          'Email verification links',
          'Hardware security keys',
          'Security questions'
        ],
        answer: 'Hardware security keys',
        rationale: 'Hardware keys require physical possession and are immune to phishing, SIM-swapping, and remote attacks.',
      },
      {
        question: 'Why should you enable 2FA on your backup email account?',
        options: [
          'It makes logging in faster',
          'Attackers often target backup emails to bypass 2FA on main accounts',
          'It is required by law',
          'It reduces spam'
        ],
        answer: 'Attackers often target backup emails to bypass 2FA on main accounts',
        rationale: 'If your backup email is unprotected, an attacker can use it to reset your main account password and disable 2FA.',
      }
    ],
    coachQuestions: [
      {
        question: 'What is SIM-swapping and why does it defeat SMS-based 2FA?',
        answer: 'SIM-swapping is when an attacker convinces your carrier to transfer your number to their device. Once they control your number, they receive your SMS codes.',
      },
      {
        question: 'How do you set up an authenticator app for a new account?',
        answer: 'Enable 2FA in account settings, scan the QR code with your authenticator app, and save the backup codes. The account then appears in your app list with rotating codes.',
      },
      {
        question: 'What should you test during a quarterly 2FA drill?',
        answer: 'Log out and attempt to log in using only your backup codes. Verify your recovery email works and your authenticator app syncs correctly.',
      },
    ],
  },
  {
    id: 'password-builder-game',
    title: 'Password Strength Builder',
    focus: 'interactive password creation and testing',
    difficulty: 'foundation',
    summary: 'Build and test password strength in real-time with interactive feedback',
    outcomes: [
      'Create strong passwords with multiple character types',
      'Understand what makes a password secure',
      'Learn password best practices',
    ],
    narrative: [
      'A strong password is your first line of defense against unauthorized access to your accounts.',
      'The best passwords combine uppercase and lowercase letters, numbers, and special characters in unpredictable ways.',
      'Password managers can help you create and store unique passwords for every account.',
    ],
    mission: 'Use the interactive tool to create a password that scores 90% or higher.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'Why should each account have a unique password?',
        answer: 'If one account is compromised, unique passwords prevent attackers from accessing your other accounts.',
      },
    ],
  },
  {
    id: 'phishing-detector-game',
    title: 'Phishing Link Detective',
    focus: 'interactive phishing link identification',
    difficulty: 'foundation',
    summary: 'Test your skills at spotting fake and malicious links',
    outcomes: [
      'Identify common phishing patterns',
      'Recognize suspicious URLs',
      'Understand link verification techniques',
    ],
    narrative: [
      'Phishing attacks trick you into clicking malicious links that look legitimate.',
      'Always examine URLs carefully before clicking, looking for misspellings and suspicious domains.',
      'When in doubt, go directly to the official website instead of clicking links.',
    ],
    mission: 'Complete the phishing detection quiz and score at least 70%.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'What are red flags in a suspicious link?',
        answer: 'Misspellings, character substitutions, shortened URLs, urgency tactics, and domains that don\'t match the claimed source.',
      },
    ],
  },
  {
    id: 'privacy-audit-game',
    title: 'Privacy Settings Simulator',
    focus: 'interactive privacy configuration',
    difficulty: 'applied',
    summary: 'Configure privacy settings and audit your digital footprint',
    outcomes: [
      'Understand privacy setting levels',
      'Make informed privacy decisions',
      'Audit and secure personal information',
    ],
    narrative: [
      'Social media platforms default to public settings to encourage sharing, but this exposes your information.',
      'Reviewing and tightening privacy settings is one of the most effective ways to protect your digital footprint.',
      'Regular privacy audits help ensure your settings haven\'t been reset by app updates.',
    ],
    mission: 'Audit all privacy settings and achieve 100% security score.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'How often should you review your privacy settings?',
        answer: 'At least quarterly, and immediately after major app updates that may reset your preferences.',
      },
    ],
  },
  {
    id: 'device-security-game',
    title: 'Device Security Scanner',
    focus: 'interactive security update management',
    difficulty: 'applied',
    summary: 'Scan your device for outdated software and security vulnerabilities',
    outcomes: [
      'Understand the importance of updates',
      'Identify security vulnerabilities',
      'Maintain updated systems',
    ],
    narrative: [
      'Outdated software is one of the biggest security risks because attackers exploit known vulnerabilities.',
      'Security updates patch holes that criminals use to break into devices.',
      'Enabling automatic updates ensures you\'re always protected with the latest security fixes.',
    ],
    mission: 'Run a security scan and update all outdated components.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'Why are updates important for security?',
        answer: 'Updates fix security vulnerabilities that attackers could exploit to access your device or data.',
      },
    ],
  },
  {
    id: 'rumor-tracker-game',
    title: 'Rumor Freeze Challenge',
    focus: 'interactive misinformation detection',
    difficulty: 'applied',
    summary: 'Identify rumors and misinformation before they spread',
    outcomes: [
      'Recognize rumor red flags',
      'Practice verification techniques',
      'Stop misinformation spread',
    ],
    narrative: [
      'Rumors spread faster than facts because they trigger emotions like fear, excitement, or outrage.',
      'The "freeze" technique means pausing before sharing to verify the information first.',
      'Responsible digital citizens fact-check before forwarding messages that could harm others.',
    ],
    mission: 'Complete the rumor detection challenge with 100% accuracy.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'What should you do if you\'re unsure if a message is true?',
        answer: 'Don\'t share it. Ask a trusted adult, check official sources, or verify through a second channel.',
      },
    ],
  },
  {
    id: '2fa-setup-game',
    title: 'Two-Factor Authentication Simulator',
    focus: 'interactive 2FA configuration',
    difficulty: 'advanced',
    summary: 'Set up and test two-factor authentication step by step',
    outcomes: [
      'Understand how 2FA works',
      'Set up authenticator apps',
      'Manage backup codes',
    ],
    narrative: [
      'Two-factor authentication adds a second verification step beyond just your password.',
      'Even if someone steals your password, they can\'t access your account without the second factor.',
      'Authenticator apps are more secure than SMS because they can\'t be intercepted through SIM swapping.',
    ],
    mission: 'Complete the 2FA setup simulation and verify with a code.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'Why is an authenticator app better than SMS for 2FA?',
        answer: 'Authenticator apps can\'t be intercepted through SIM swapping attacks, and they work without cell service.',
      },
    ],
  },
];

