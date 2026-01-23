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
          'Legitimate staff have official communication channels and would never pressure students for passwords via text. Independent verification through trusted channels stops social engineering attacks. The urgency is designed to bypass your critical thinking.',
      },
      {
        question: 'A stranger switches from casual slang to urgent commands mid-thread. What label should you add to your evidence board?',
        options: [
          'Humor shift',
          'Authority hijack',
          'Pressure escalation',
          'Grammar fail'
        ],
        answer: 'Authority hijack',
        rationale: 'Sudden shifts from casual to authoritative tone signal manipulation. Attackers impersonate authority figures to create pressure and compliance. Labeling the tactic intellectually helps you resist emotional manipulation and builds pattern recognition for future attacks.',
      },
      {
        question: 'Which combination proves you actually verified a suspicious request?',
        options: [
          'Screenshot + DM reply',
          'Voice memo + group chat alert',
          'Second-channel confirmation + timestamped note',
          'Quick reply + forwarded message'
        ],
        answer: 'Second-channel confirmation + timestamped note',
        rationale: 'Verification requires using a completely separate communication channel—not just replying in the same app. Timestamped documentation creates an audit trail that adults can trust. This combination proves you took proper security steps and provides evidence if needed later.',
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
        rationale: 'Publicly confronting attackers alerts them that you are aware, causing them to delete evidence, change tactics, or target others. Silent documentation preserves evidence for investigation while protecting your classmates. Professional investigators always gather proof before confrontation.',
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
          'This recipe describes the structure without exposing the final password. The site-specific salt (nova) and personal symbol mapping (brass riff) create uniqueness. Even if someone sees your notes, they cannot reconstruct your actual password without knowing your personal symbol translations.',
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
        rationale: 'Password reuse is one of the biggest security mistakes. When one site gets breached, attackers test those credentials everywhere. Each account needs its own unique salt or modification. Adding the same symbol to all accounts recreates the reuse vulnerability you are trying to avoid.',
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
        rationale: 'Recipe notation creates a separation between what is written and what is typed. Symbols like "+sunset riff" are meaningless to anyone who finds your notebook, but instantly trigger your memory system. This layered approach protects even if someone photographs your notes or finds them in a lost backpack.',
      },
      {
        question: 'How often should you run a reuse audit on high-value accounts?',
        options: ['Once a year', 'Whenever you get bored', 'Every season or after any breach alert', 'Never if you use symbols'],
        answer: 'Every season or after any breach alert',
        rationale: 'Major sites experience data breaches regularly—sometimes millions of passwords leak at once. Quarterly audits ensure you catch reuse patterns, update compromised credentials, and respond to breach notifications before attackers exploit them. This proactive approach significantly reduces your risk of account compromise.',
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
          'Complete data removal requires three steps: export your content for your records, deactivate/delete the account to stop new exposure, and verify removal from search engines through Google Search Console or waiting for re-indexing. Partial removal leaves traces that can still harm your privacy.',
      },
      {
        question: 'You notice an app requesting microphone access for no reason. What belongs in your footprint log?',
        options: ['Date and time only', 'Permission type, reason, and whether you revoked it', 'A selfie proving you denied it', 'Nothing; it is normal'],
        answer: 'Permission type, reason, and whether you revoked it',
        rationale: 'Comprehensive logs track what you allowed, why you allowed it, and whether you revoked it. This creates an audit trail for future reviews and helps you notice patterns—like apps requesting similar permissions after updates. Documentation transforms vague concerns into actionable security practices.',
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
        rationale: 'Old devices are treasure troves of logged-in accounts, saved passwords, cached photos, and browsing history. Factory reset alone may not fully erase data—professional recovery tools can restore it. Proper sequence: remove all accounts, perform factory reset, verify wipe completion, then transfer or recycle.',
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
        rationale: 'Minimizing exposure protects everyone. Emails in public documents enable spammers, phishers, and social engineers to target people. Locking sharing permissions and using platform-specific usernames instead of emails demonstrates digital citizenship and reduces collective risk for your entire community.',
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
          'Incident response follows a clear priority: contain the threat, preserve evidence, then escalate. Immediately isolating the affected device prevents malware spread or data exfiltration. Your documented evidence helps professionals conduct forensic analysis. Public callouts alert attackers and give them time to cover tracks.',
      },
      {
        question: 'Which detail matters most in your incident journal entry?',
        options: ['The background color of the chat', 'Exact timestamps and usernames involved', 'How angry you felt', 'Who first posted the rumor'],
        answer: 'Exact timestamps and usernames involved',
        rationale: 'Precise timestamps and usernames enable forensic reconstruction. Security professionals can correlate your log with server records, identify attack vectors, and trace compromise patterns. Background colors and emotions are irrelevant for technical investigation and dilute the signal in your report.',
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
        rationale: 'Premature disclosure is a tactical error. Attackers monitor social media for mentions of their campaigns. When they see public warnings, they delete evidence, change infrastructure, and target new victims before defenders respond. Coordinated timing gives security teams maximum advantage for intervention.',
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
        rationale: 'Debriefs transform incidents into institutional knowledge. Even "close calls" reveal gaps in procedures, communication, and preparation. Structured reflection builds team muscle memory, reduces future response time, and creates psychological safety—knowing you can handle problems makes new threats less intimidating.',
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
        rationale: 'Security hygiene requires layered protection. Backups prevent data loss from failed updates. OS patches close system-level vulnerabilities first. Then app and browser updates protect your daily tools. This sequence ensures updates do not leave you vulnerable if something breaks mid-process.',
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
        rationale: 'Unknown apps requesting sensitive permissions are immediate threats. Microphone access enables eavesdropping, keylogging, and data exfiltration. Removal eliminates the threat surface. Documentation creates accountability—if the app returns or similar patterns emerge, your log reveals the attack campaign.',
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
        rationale: 'Browser extensions access every website you visit, capturing passwords, reading emails, and tracking behavior. Redundant extensions are unnecessary attack surface. New ad behavior often signals acquisition by malicious actors who inject tracking and malware. Remove before they update with worse payloads.',
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
        rationale: 'Maintenance logs serve multiple purposes: they prove due diligence to adults, reveal malware that survives basic cleanups through repetition patterns, and build your confidence through visible progress. Paper trails transform abstract security into concrete habits you can demonstrate and improve.',
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
        rationale: 'Professional briefings lead with facts and actions, demonstrating control and preparedness. Specific timestamps remove ambiguity. Listing completed containment steps shows initiative. This format signals to adults that you are managing the situation competently and tells them exactly what additional resources you need.',
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
        rationale: 'Decision-makers need clarity, not blame or entertainment. The "ask" section should specify exactly what approval, access, or resources you need. Clear requests like "Need admin to reset shared drive permissions" enable immediate action. Vague briefings waste time and extend exposure windows.',
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
        rationale: 'Every incident—large or small—is a training opportunity. Quick debriefs identify what procedures worked, what communication broke down, and what skills need strengthening. This builds organizational resilience: your team becomes faster, calmer, and more coordinated with each event.',
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
        rationale: 'Report integrity is critical. Unverified rumors mixed with facts undermine credibility and can cause inappropriate responses. Create a clearly labeled "pending verification" section or separate document for speculative information. This maintains trust while acknowledging helpful contributions from teammates.',
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
        rationale: 'URL shorteners like bit.ly hide the true destination, making them perfect for phishing. Free expander tools or sandbox environments reveal the actual domain without loading malicious content on your device. Always expand before clicking—legitimate senders have nothing to hide.',
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
        rationale: 'Domain names work right-to-left. In "schoolupdates.education-login.com", the real domain is "education-login.com"—a completely different entity from your school. Everything before it is a subdomain they control. Attackers exploit this by stacking official-sounding words before their fraudulent domain.',
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
        rationale: 'Pattern documentation is more convincing than single reports. When you show administrators five examples of similar phishing attempts from your ledger, they can block the source network-wide instead of treating each as isolated. Your records accelerate protection for the entire community.',
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
        rationale: 'QR codes bypass your visual verification—you cannot see the URL before scanning. Photographing the poster preserves location, timing, and appearance for verification. Asking "who benefits?" reveals motive—legitimate school activities are announced through official channels, not anonymous overnight posters.',
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
        rationale: 'Starting with "Pause" acknowledges the emotional energy without dismissing it. Offering verified facts provides direction and reduces anxiety. This approach invites collaboration rather than triggering defensiveness, making others more likely to help you gather accurate information.',
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
        rationale: 'Emotions are valid and need processing, but mixing them with factual reports creates confusion and bias. Separate columns let you acknowledge how situations feel while maintaining objective timelines. This discipline makes your reports credible to adults and keeps you emotionally regulated during stressful investigations.',
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
        rationale: 'Professional investigations require verifiable evidence. Timestamps establish sequence, screenshots preserve content before deletion, and action steps show proactive response. Together, these elements create a credible record that adults can act on immediately. Feelings and memes belong in your personal processing, not official reports.',
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
        rationale: 'Unverified public posts often cause more harm than the original rumor. They spread panic, damage reputations, and force adults to manage multiple crisis responses. Coordinated messaging with trusted adults ensures accuracy, timing, and tone that protects everyone involved. Your patience demonstrates maturity and leadership.',
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
          'Using colorful formatting',
          'Assigning roles and backups next to each action',
          'Making it all caps',
          'Hiding it on your desktop',
        ],
        answer: 'Assigning roles and backups next to each action',
        rationale: 'Playbooks require accountability. Role assignment with backup designations ensures tasks get completed even when key people are absent. Clear ownership prevents duplication, confusion, and gaps. This structure transforms vague guidance into executable procedures that work under stress.',
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
        rationale: 'Digital devices fail during incidents—they get compromised, locked, or have dead batteries. Physical copies remain accessible when technology fails. Redundancy across formats (digital and physical) and locations (home, school, trusted adult) ensures your playbook is available exactly when you need it most.',
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
        rationale: 'Static playbooks become obsolete. The review section captures friction points, communication gaps, and procedure ambiguities discovered during execution. These lessons directly inform the next revision, making each iteration more practical. Living documents adapt to your team and evolving threats.',
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
        rationale: 'Backup assignments prevent single points of failure. When the primary person is unavailable, sick, or overwhelmed, the backup immediately assumes the role without discussion or delay. Logging gaps during execution identifies training needs and role reassignments for the next drill. Resilient teams have redundancy.',
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
        rationale: 'Deactivation is temporary invisibility—your data remains on servers and can be reactivated. Deletion initiates permanent removal, though platforms impose waiting periods (typically 30-90 days) allowing you to cancel if you change your mind. Always export your data before deletion; once the waiting period ends, recovery is impossible.',
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
        rationale: 'Email addresses serve as unique identifiers across platforms. Many sites display emails publicly in user profiles, forum posts, or comment sections even when you use a pseudonym. Forgotten forum accounts from years ago may still broadcast your current email, enabling targeted phishing and social engineering attacks.',
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
        rationale: 'Platforms frequently introduce features with privacy-invasive defaults, bury controls deeper in menus, or silently reset preferences during redesigns. Quarterly audits counteract this gradual erosion. Major updates often include new data-sharing partnerships and AI training opt-outs that you must manually disable.',
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
        rationale: 'EXIF metadata is invisible but revealing. GPS coordinates pinpoint your home, school, and routine locations. Camera model and timestamps create patterns. Stalkers, burglars, and predators extract this data from photos shared online. Disable geotagging in camera settings, or use metadata-stripping tools before sharing photos.',
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
        rationale: 'SMS codes travel over cellular networks that criminals can intercept. SIM-swapping attacks let attackers transfer your phone number to their device by social engineering your carrier. Once they control your number, SMS codes go to them. Authenticator apps generate codes locally on your physical device, eliminating network interception.',
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
        rationale: 'Backup codes are your emergency access. If your phone breaks, gets stolen, or factory resets, these codes are the only way to regain account access without lengthy identity verification. Digital storage creates a circular dependency—if you are locked out, you cannot access your cloud storage. Offline storage breaks this dependency.',
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
        rationale: 'Hardware keys verify the website domain cryptographically before releasing codes, preventing phishing on lookalike domains. They are immune to SIM-swapping, malware, and remote attacks because they require physical possession and proximity. For administrator accounts, cryptocurrency wallets, and high-value targets, hardware keys provide maximum protection.',
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
        rationale: 'Account security is only as strong as the weakest link. Attackers target backup emails specifically because they provide password reset access. Once they control your backup email, they can disable 2FA on your main account by requesting a password reset. Securing the entire recovery chain prevents this bypass.',
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
      'Create passwords with 12+ characters mixing uppercase, lowercase, numbers, and symbols',
      'Understand the difference between password complexity and true strength',
      'Learn to evaluate password strength and identify weak patterns',
      'Recognize common password mistakes that make accounts vulnerable',
    ],
    narrative: [
      'A strong password is your first line of defense against unauthorized access to your accounts. Think of it as the lock on your digital front door—if it is weak, intruders can easily break in.',
      'The best passwords combine uppercase and lowercase letters, numbers, and special characters in unpredictable ways. Avoid common patterns like "Password123!" or "Qwerty@2024" that attackers test first.',
      'Length matters more than complexity. A 16-character passphrase like "purple-mountain-lake-sunrise" is stronger than "P@ssw0rd" because it takes exponentially longer to crack.',
      'Password managers are your secret weapon. They generate cryptographically random passwords, store them securely, and auto-fill them so you never have to remember more than one master password.',
      'Never reuse passwords across accounts. If one site gets breached, attackers immediately test those credentials on banking, email, and social media platforms. Unique passwords contain the damage.',
      'Beware of personal information. Birthdays, pet names, and favorite sports teams appear in data breaches and social media profiles. Attackers use this information to guess passwords through targeted attacks.',
      'Regular password updates for high-value accounts—like email and banking—add another layer of protection. Set quarterly reminders to rotate credentials and review account activity.',
    ],
    mission: 'Use the interactive tool to create three different passwords that each score 90% or higher. Then, identify what makes them strong and write down your password creation strategy for future use.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'Why should each account have a unique password?',
        answer: 'If one account is compromised, unique passwords prevent attackers from accessing your other accounts.',
      },
      {
        question: 'What makes a passphrase stronger than a short complex password?',
        answer: 'Length creates exponentially more combinations than complexity. A 16-character passphrase takes millions of times longer to crack than an 8-character password with symbols.',
      },
      {
        question: 'How does a password manager protect you beyond just storing passwords?',
        answer: 'It generates truly random passwords, detects phishing sites by only auto-filling on legitimate domains, and alerts you to breached credentials.',
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
      'Identify domain spoofing and URL manipulation techniques',
      'Recognize urgency tactics and emotional manipulation in phishing messages',
      'Practice safe link verification using hover, preview, and manual navigation',
      'Understand the anatomy of phishing attacks and common pretexts',
    ],
    narrative: [
      'Phishing attacks trick you into clicking malicious links that look legitimate. Attackers impersonate banks, schools, popular services, and even friends to steal your credentials or install malware.',
      'Always examine URLs carefully before clicking. Look for misspellings like "paypa1.com" instead of "paypal.com", extra subdomains like "secure-login.verified-amazon-shop.net", or suspicious top-level domains like ".tk" or ".xyz".',
      'Urgency is a weapon. Messages claiming "Your account will be locked in 24 hours!" or "Click now to claim your prize!" trigger panic and bypass your critical thinking. Legitimate organizations give you time to respond.',
      'Hover before you click. On desktop, hovering over a link reveals the actual URL without opening it. On mobile, long-press the link to preview the destination. If it does not match the claimed source, do not click.',
      'When in doubt, go directly to the official website instead of clicking links in emails or messages. Type the URL manually or use a bookmarked link you trust.',
      'Check the sender carefully. Phishing emails often come from addresses like "support@paypa1-secure.com" instead of the real "support@paypal.com". One character difference can hide a fake domain.',
      'Look for poor grammar and formatting. While not all phishing attempts have errors, many contain awkward phrasing, inconsistent fonts, or low-quality logos that reveal their fraudulent nature.',
    ],
    mission: 'Complete the phishing detection challenge by correctly identifying at least 7 out of 10 links, then document the three most deceptive techniques you encountered.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'What are red flags in a suspicious link?',
        answer: 'Misspellings, character substitutions, shortened URLs, urgency tactics, and domains that don\'t match the claimed source.',
      },
      {
        question: 'Why do phishing messages use urgent language like "Act now or lose access"?',
        answer: 'Urgency triggers panic and bypasses critical thinking. When you feel rushed, you are more likely to click without verifying the sender or link.',
      },
      {
        question: 'What should you do if you accidentally clicked a phishing link?',
        answer: 'Disconnect from internet immediately, change passwords on a different device, scan for malware, and report it to your IT admin or trusted adult.',
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
      'Audit visibility settings for posts, photos, contact information, and friend lists',
      'Review and restrict app permissions for camera, microphone, location, and contacts',
      'Understand privacy trade-offs and make informed decisions about data sharing',
      'Create a repeatable privacy audit checklist for quarterly reviews',
    ],
    narrative: [
      'Social media platforms default to public settings to encourage sharing and growth, but this exposes your information to strangers, advertisers, and potential threats. You have the power to control what you share.',
      'Reviewing and tightening privacy settings is one of the most effective ways to protect your digital footprint. Most platforms bury these controls deep in menus, hoping you will not find them.',
      'Regular privacy audits help ensure your settings have not been reset by app updates. Platforms frequently change interfaces and re-enable sharing features during updates—checking quarterly keeps you protected.',
      'Control who can see your posts, contact you, tag you in photos, and view your friends list. Each of these settings leaks information that attackers and advertisers collect to build profiles about you.',
      'Review app permissions on your phone and computer. Many apps request access to your camera, microphone, location, and contacts even when they do not need them. Deny unnecessary permissions and revoke them regularly.',
      'Search your name on Google, Bing, and other engines to see what others can find about you. Look for old profiles, leaked information, and data broker listings that you can request to remove.',
      'Two-factor authentication and strong passwords protect your privacy settings from being changed by attackers. If someone gains access to your account, they can undo all your privacy work and leak your data.',
    ],
    mission: 'Complete a full privacy audit achieving 100% security score by reviewing all settings, then create a written checklist to use for quarterly audits on your real accounts.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'How often should you review your privacy settings?',
        answer: 'At least quarterly, and immediately after major app updates that may reset your preferences.',
      },
      {
        question: 'What information can attackers gather from a public social media profile?',
        answer: 'Your location patterns, friend network, schedule, interests, family details, and answers to common security questions like pet names or schools.',
      },
      {
        question: 'Why should you review app permissions regularly?',
        answer: 'Apps often request more access than needed and can update to add new permissions. Regular reviews ensure apps only access what they genuinely require.',
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
      'Identify outdated operating systems, browsers, and applications that need updates',
      'Understand critical vs. optional updates and prioritize security patches',
      'Learn to enable automatic updates for OS, browsers, and security software',
      'Recognize malicious browser extensions and unnecessary app permissions',
    ],
    narrative: [
      'Outdated software is one of the biggest security risks because attackers exploit known vulnerabilities. When companies discover security flaws, they release patches—but only users who update receive protection.',
      'Security updates patch holes that criminals use to break into devices. These vulnerabilities allow malware installation, data theft, and remote control of your device by attackers.',
      'Enabling automatic updates ensures you are always protected with the latest security fixes. Most operating systems and apps offer this feature—turn it on for critical software like your OS, browser, and messaging apps.',
      'Browser extensions and plugins can be trojan horses. Many start legitimate but get sold to malicious actors who inject ad trackers, keyloggers, or data scrapers in updates. Review your extensions monthly and remove any you do not actively use.',
      'Antivirus and anti-malware software provides real-time protection against threats. While built-in protection on Windows, Mac, and mobile devices has improved, additional layers help, especially for devices used by younger siblings.',
      'Physical security matters too. Screen locks, encryption, and Find My Device features protect your data if your phone or laptop is lost or stolen. Set these up before you need them.',
      'Back up important files regularly to an external drive or secure cloud service. If ransomware encrypts your device or hardware fails, backups let you restore everything without paying criminals or losing memories.',
    ],
    mission: 'Run a complete security scan, update all outdated components, remove at least one unnecessary browser extension, and document your maintenance routine for future weekly checks.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'Why are updates important for security?',
        answer: 'Updates fix security vulnerabilities that attackers could exploit to access your device or data.',
      },
      {
        question: 'What should you do before installing a new browser extension?',
        answer: 'Check reviews, verify the publisher, review requested permissions, and research whether the extension has been compromised or sold to malicious actors.',
      },
      {
        question: 'How does enabling Find My Device help if your phone is stolen?',
        answer: 'It lets you locate, lock, or remotely wipe your device to prevent thieves from accessing your data, accounts, and personal information.',
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
      'Identify emotional manipulation tactics like urgency, fear, and outrage bait',
      'Practice source verification using reverse image search and fact-checking sites',
      'Apply the freeze-verify-decide framework before sharing information',
      'Distinguish between facts, opinions, and unverified claims in messages',
    ],
    narrative: [
      'Rumors spread faster than facts because they trigger emotions like fear, excitement, or outrage. Your brain is wired to pay attention to threats and surprises, which makes sensational claims feel true even when they are not.',
      'The "freeze" technique means pausing before sharing to verify the information first. This simple habit breaks the chain of misinformation and protects others from making decisions based on false claims.',
      'Responsible digital citizens fact-check before forwarding messages that could harm others. Ask: Who benefits from this rumor? Can I verify it through official sources? What happens if I am wrong?',
      'Check the source. Does the claim come from a verified news outlet, official organization, or a random social media post? Screenshots can be doctored, and fake accounts impersonate real people.',
      'Look for corroboration. If a story is real, multiple credible sources will report it independently. If only one suspicious account is sharing it, treat it as unverified until proven otherwise.',
      'Beware of emotional language. Phrases like "BREAKING: You won\'t believe..." or "URGENT: Share before they delete this!" manipulate your emotions to bypass critical thinking. Calm down before you click share.',
      'Use reverse image search and fact-checking sites. Tools like Google Images, Snopes, and FactCheck.org help you verify whether photos, videos, and claims are authentic before you spread them further.',
    ],
    mission: 'Complete the rumor detection challenge with 100% accuracy by correctly identifying all false claims, then practice verifying one real-world viral post using fact-checking tools.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'What should you do if you\'re unsure if a message is true?',
        answer: 'Don\'t share it. Ask a trusted adult, check official sources, or verify through a second channel.',
      },
      {
        question: 'How can you verify whether a viral image or video is real?',
        answer: 'Use reverse image search on Google Images or TinEye, check fact-checking sites like Snopes, and look for the original source and context.',
      },
      {
        question: 'Why is it important to pause before sharing sensational claims?',
        answer: 'False information can harm reputations, cause panic, or lead others to make bad decisions. Pausing breaks the chain and protects your community.',
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
      'Understand the differences between SMS, authenticator apps, and hardware keys',
      'Successfully set up an authenticator app with QR code scanning',
      'Generate, store, and test backup codes for account recovery',
      'Identify which accounts need 2FA most urgently based on risk level',
    ],
    narrative: [
      'Two-factor authentication adds a second verification step beyond just your password. This additional layer dramatically reduces the risk of unauthorized access, even if your password is compromised.',
      'Even if someone steals your password through phishing, data breaches, or keyloggers, they cannot access your account without the second factor—something you physically possess like your phone or security key.',
      'Authenticator apps are more secure than SMS because they cannot be intercepted through SIM swapping attacks. When an attacker convinces your phone carrier to transfer your number, SMS codes go to them—but authenticator apps stay on your device.',
      'Popular authenticator apps include Google Authenticator, Microsoft Authenticator, Authy, and Duo Mobile. They generate time-based one-time passwords that refresh every 30 seconds and work even without internet connection.',
      'Set up 2FA on your most critical accounts first: email, password manager, banking apps, and social media. Your email is especially important because attackers use it to reset passwords for all your other accounts.',
      'Save backup codes in a secure offline location when you enable 2FA. If you lose your phone or security key, backup codes are the only way to regain access without lengthy account recovery processes.',
      'Hardware security keys like YubiKey provide the strongest protection for high-value accounts. They are immune to phishing because they verify the website\'s authenticity before sending codes, preventing credential theft on fake sites.',
    ],
    mission: 'Complete the full 2FA setup simulation including scanning a QR code, verifying with a generated code, saving backup codes, and testing account recovery with a backup code.',
    quizzes: [],
    coachQuestions: [
      {
        question: 'Why is an authenticator app better than SMS for 2FA?',
        answer: 'Authenticator apps can\'t be intercepted through SIM swapping attacks, and they work without cell service.',
      },
      {
        question: 'What should you do with backup codes after enabling 2FA?',
        answer: 'Print them and store them in a secure offline location like a safe or locked drawer. Never email them or save them in cloud notes.',
      },
      {
        question: 'Which accounts should you prioritize for 2FA first?',
        answer: 'Start with email, password manager, and banking. Your email is critical because attackers use it to reset passwords for all other accounts.',
      },
    ],
  },
];

