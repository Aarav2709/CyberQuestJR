import { CheckCircle2, Sparkles, Shield, MessageCircle, Target, Lightbulb, Brain, Lock, Eye } from 'lucide-react';

const pillars = [
  {
    title: 'Story-first safety',
    detail: 'Every lesson is a mini comic script where you play the hero shutting down shady links. No lectures, just real conversations you might see in your own group chats.',
  },
  {
    title: 'Hands-on practice',
    detail: 'Try bite-sized challenges right inside the page before leveling up to the next chapter. Build muscle memory through interactive scenarios that mirror real-world threats.',
  },
  {
    title: 'Youth-friendly glossary',
    detail: 'No boring jargon. We explain every cyber buzzword with teen slang and simple visuals. Learn the language of digital safety in words that actually make sense.',
  },
];

const readingStacks = [
  {
    icon: Brain,
    title: 'Scene primer',
    detail: 'Start every session by reading the scene aloud once, then again while underlining every pressure verb and suspicious timestamp. This double-pass method helps you spot manipulation tactics faster.',
  },
  {
    icon: Eye,
    title: 'Context layering',
    detail: 'List who benefits, who is confused, and who is silent. That column of motives turns a chat log into a detective board. Understanding the why behind each message reveals the scam.',
  },
  {
    icon: Lock,
    title: 'Response rehearsal',
    detail: 'Write the sentence you would send, plus the calmer version you would actually deliver. Editing your reply builds muscle memory for high-pressure moments when you need it most.',
  },
];

const deepDives = [
  {
    icon: Target,
    title: 'Phishing pattern recognition',
    text: 'Learn to spot the telltale signs: urgency language, emotional manipulation, and fake authority. We break down real phishing attempts line by line so you can recognize them before you click.',
  },
  {
    icon: Shield,
    title: 'Password security architecture',
    text: 'Master the art of creating unbreakable passphrases using memory palaces and personal symbols. We teach you to build passwords that are mathematically secure yet easy to remember.',
  },
  {
    icon: Lightbulb,
    title: 'Digital footprint mapping',
    text: 'Discover what strangers can learn about you from your online presence. We guide you through auditing your accounts, privacy settings, and metadata to minimize exposure.',
  },
  {
    icon: MessageCircle,
    title: 'Incident response protocols',
    text: 'Know exactly what to do when something goes wrong. We provide step-by-step recovery guides for compromised accounts, leaked data, and suspicious activity. No panic required.',
  },
];

const sampleQuestions = [
  {
    q: 'A stranger sends a homework key that needs your school login. What do you slow down and check first?',
    a: 'Pause and look for pressure signals: urgent deadlines, threats of missing out, or requests for personal info. Confirm the sender through another channel (call or in-person), and screenshot the thread for adults. Never give credentials to unverified sources.',
  },
  {
    q: 'Your friend reused a password across three apps. How do you coach them without sounding bossy?',
    a: 'Walk them through your own passphrase recipe. Show them how you build memorable but unique passwords for each service. Help them set a calendar reminder to rotate passwords every season. Lead by example rather than lecturing.',
  },
  {
    q: 'You discover an old public profile from middle school. What is the fastest shutdown plan?',
    a: 'Export the posts you want to keep (photos, messages). Deactivate or delete the account through its settings. Search your name and email on Google to confirm it has vanished. Set up Google Alerts for your name to monitor future mentions.',
  },
  {
    q: 'Someone screenshots your private chat and threatens to share it. How do you respond?',
    a: 'Do not engage or negotiate. Screenshot the threat and report it to the platform immediately. Tell a trusted adult (parent, teacher, counselor). Block the person. Document everything with timestamps in case you need evidence later.',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 grid-spark opacity-40" aria-hidden />

      {/* Hero Section */}
      <div className="mx-auto flex min-h-[85vh] max-w-6xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center">
        <section className="flex-1 space-y-8 animate-fade-in">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/10">
            <Sparkles className="h-3.5 w-3.5 text-glow-amber animate-pulse" />
            Teen-safe missions
          </p>

          <h1 className="text-5xl font-bold leading-tight text-gradient sm:text-6xl lg:text-7xl transition-all duration-500">
            Build hacker-proof habits before high school.
          </h1>

          <div className="space-y-5 text-lg leading-relaxed text-white/75">
            <p className="transition-colors duration-300 hover:text-white/90">
              CyberQuest Jr is a cozy training base for ages 11 to 17. Every studio is written like a scene from a group chat, so you read how scammers actually talk and how a calm responder thinks through the chaos.
            </p>
            <p className="transition-colors duration-300 hover:text-white/90">
              Instead of sprinting through tips, we slow down. You annotate evidence, label motives, sketch passphrase recipes, map your digital footprint, and rehearse incident reports. It is pure reading time with lots of what if detours and no timers.
            </p>
            <p className="transition-colors duration-300 hover:text-white/90">
              The flow is simple: read, rewrite, then summarize. Every paragraph ends with a reflection question so you spend more time thinking than tapping. Bring a notebook and copy the lines that hit you the hardest.
            </p>
            <p className="transition-colors duration-300 hover:text-white/90">
              We cover everything from spotting phishing emails to building fortress-grade passwords, from cleaning up your digital footprint to handling cyberbullying incidents. Each lesson includes real-world examples, expert insights, and interactive quizzes that test your understanding.
            </p>
          </div>

          {/* Reading Framework */}
          <div className="grid gap-4 rounded-3xl border border-white/12 bg-white/5 p-6 text-sm text-white/80 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/8">
            <h3 className="text-base font-semibold uppercase tracking-[0.3em] text-white/90">Reading Framework</h3>
            {readingStacks.map((stack, idx) => {
              const Icon = stack.icon;
              return (
                <div
                  key={stack.title}
                  className="flex gap-3 transition-all duration-300 hover:translate-x-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-glow-lime" />
                  <div>
                    <p className="text-base font-semibold text-white">{stack.title}</p>
                    <p className="mt-1 leading-relaxed text-white/75">{stack.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Dive Topics */}
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-black/50">
            <h3 className="mb-4 text-base font-semibold uppercase tracking-[0.3em] text-white/90">Core Topics</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {deepDives.map((topic, idx) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.title}
                    className="rounded-2xl border border-white/8 bg-white/5 p-4 transition-all duration-300 hover:border-white/15 hover:bg-white/10 hover:scale-105"
                    style={{ animationDelay: `${idx * 75}ms` }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-glow-amber" />
                      <p className="text-sm font-semibold text-white">{topic.title}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-white/70">{topic.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <section className="flex-1 space-y-6 animate-fade-in-delay">
          <div className="card-hover transition-all duration-500 hover:scale-[1.02]">
            <header className="mb-5 flex items-center gap-3">
              <Shield className="h-5 w-5 text-glow-lime" />
              <div>
                <h2 className="text-2xl font-semibold text-white">Mission Pillars</h2>
              </div>
            </header>
            <ul className="space-y-4 text-sm text-white/80">
              {pillars.map((block, idx) => (
                <li
                  key={block.title}
                  className="flex gap-3 transition-all duration-300 hover:translate-x-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-glow-amber" />
                  <div>
                    <p className="font-semibold text-white">{block.title}</p>
                    <p className="leading-relaxed">{block.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-hover transition-all duration-500 hover:scale-[1.02]">
            <header className="mb-4 flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-glow-orange" />
              <div>
                <h2 className="text-xl font-semibold text-white">Sample Scenarios</h2>
              </div>
            </header>
            <div className="space-y-4 text-sm text-white/80">
              {sampleQuestions.map((item, idx) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-white/8 bg-surface-100/80 p-4 transition-all duration-300 hover:border-white/15 hover:bg-surface-100 hover:scale-[1.02]"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <p className="font-semibold text-white leading-relaxed">Q: {item.q}</p>
                  <p className="mt-3 leading-relaxed text-white/75">A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
