import { useState } from 'react';

const PasswordBuilder: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    const length = pwd.length;

    // Length scoring (up to 35 points)
    if (length >= 8) score += 15;
    if (length >= 12) score += 10;
    if (length >= 16) score += 10;

    // Character variety (up to 40 points)
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 10;

    // Pattern analysis (up to 25 points)
    const hasMultipleCharTypes = [
      /[a-z]/.test(pwd),
      /[A-Z]/.test(pwd),
      /[0-9]/.test(pwd),
      /[^a-zA-Z0-9]/.test(pwd)
    ].filter(Boolean).length;

    if (hasMultipleCharTypes >= 3) score += 10;
    if (hasMultipleCharTypes >= 4) score += 5;

    // Check for common patterns (penalties)
    const commonPatterns = ['123', 'abc', 'password', 'admin', 'qwerty', '111', '000'];
    const lowerPwd = pwd.toLowerCase();
    if (commonPatterns.some(pattern => lowerPwd.includes(pattern))) {
      score -= 15;
    }

    // Sequential characters penalty
    if (/(.)\1{2,}/.test(pwd)) score -= 10;

    // Bonus for excellent length
    if (length >= 20) score += 10;

    return Math.max(0, Math.min(100, score));
  };

  const getPasswordFeedback = (pwd: string) => {
    const feedback = [];

    if (pwd.length < 8) feedback.push('Too short - aim for at least 12 characters');
    if (!/[a-z]/.test(pwd)) feedback.push('Add lowercase letters (a-z)');
    if (!/[A-Z]/.test(pwd)) feedback.push('Add uppercase letters (A-Z)');
    if (!/[0-9]/.test(pwd)) feedback.push('Add numbers (0-9)');
    if (!/[^a-zA-Z0-9]/.test(pwd)) feedback.push('Add special characters (!@#$%^&*)');

    const commonPatterns = ['123', 'abc', 'password', 'admin', 'qwerty'];
    const lowerPwd = pwd.toLowerCase();
    if (commonPatterns.some(pattern => lowerPwd.includes(pattern))) {
      feedback.push('Avoid common patterns and words');
    }

    if (/(.)\1{2,}/.test(pwd)) {
      feedback.push('Avoid repeating characters');
    }

    if (pwd.length >= 12 && feedback.length === 0) {
      feedback.push('Excellent! This password is strong.');
    }

    return feedback;
  };

  const strength = calculateStrength(password);
  const strengthLabel =
    strength < 30 ? 'Very Weak' :
    strength < 50 ? 'Weak' :
    strength < 70 ? 'Fair' :
    strength < 90 ? 'Strong' :
    'Excellent';

  const strengthColor =
    strength < 30 ? 'from-red-600 to-red-500' :
    strength < 50 ? 'from-orange-500 to-orange-400' :
    strength < 70 ? 'from-yellow-500 to-amber-500' :
    strength < 90 ? 'from-glow-lime to-glow-amber' :
    'from-green-500 to-emerald-400';

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 12 characters (recommended)', met: password.length >= 12 },
    { label: 'Contains uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'Contains number (0-9)', met: /[0-9]/.test(password) },
    { label: 'Contains special character (!@#$%)', met: /[^a-zA-Z0-9]/.test(password) },
    { label: 'No common patterns detected', met: !['123', 'abc', 'password', 'admin', 'qwerty'].some(p => password.toLowerCase().includes(p)) },
  ];

  const feedback = getPasswordFeedback(password);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-white">Password Strength Builder</h3>
        <p className="mt-2 text-sm text-white/70">Create a password and watch its strength grow in real-time. Aim for 90% or higher!</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Your Password</label>
          <input
            type={showFeedback ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password here..."
            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder-white/40 focus:border-glow-amber focus:outline-none focus:ring-2 focus:ring-glow-amber/50"
          />
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="mt-2 text-xs text-glow-amber hover:text-glow-lime transition-colors"
          >
            {showFeedback ? 'Hide' : 'Show'} Password
          </button>
        </div>

        {password.length > 0 && (
          <>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Strength: {strengthLabel}</span>
                <span className="text-sm text-white/60">{strength}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full bg-gradient-to-r ${strengthColor} transition-all duration-300`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-3">Security Checklist</p>
              <div className="space-y-2">
                {checks.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-1.5 ${check.met ? 'text-green-400' : 'text-white/30'}`}>
                      {check.met ? '[PASS]' : '[ ]'}
                    </span>
                    <span className={`text-sm ${check.met ? 'text-white' : 'text-white/50'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {feedback.length > 0 && (
              <div className={`rounded-xl border p-4 ${
                strength >= 90 ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'
              }`}>
                <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Feedback</p>
                <ul className="space-y-1">
                  {feedback.map((tip, idx) => (
                    <li key={idx} className={`text-sm ${strength >= 90 ? 'text-green-300' : 'text-yellow-300'}`}>
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {strength >= 90 && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 animate-fadeIn">
                <p className="text-sm font-semibold text-green-300 mb-2">
                  [SUCCESS] Excellent Password!
                </p>
                <p className="text-sm text-green-300/80">
                  This password is strong and secure. Remember to never reuse it across different sites. Consider using a password manager to store it safely.
                </p>
              </div>
            )}
          </>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
          <p className="font-semibold text-white/80 mb-2">Password Best Practices:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Use a unique password for every account - never reuse</li>
            <li>Consider using passphrases: 4-5 random words are easier to remember</li>
            <li>Avoid personal information (birthdays, pet names, addresses)</li>
            <li>Enable two-factor authentication (2FA) for added security</li>
            <li>Use a reputable password manager to store all your passwords</li>
            <li>Change passwords immediately if you suspect a breach</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordBuilder;
