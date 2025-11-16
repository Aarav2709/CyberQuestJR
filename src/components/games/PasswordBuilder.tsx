import { useState } from 'react';

const PasswordBuilder: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 20;
    if (pwd.length >= 16) score += 10;
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
    return Math.min(100, score);
  };

  const strength = calculateStrength(password);
  const strengthLabel = strength < 40 ? 'Weak' : strength < 70 ? 'Medium' : strength < 90 ? 'Strong' : 'Excellent';
  const strengthColor = strength < 40 ? 'from-red-500 to-orange-500' : strength < 70 ? 'from-yellow-500 to-amber-500' : strength < 90 ? 'from-glow-lime to-glow-amber' : 'from-green-500 to-emerald-500';

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Contains special character (!@#$%)', met: /[^a-zA-Z0-9]/.test(password) },
    { label: 'At least 12 characters (recommended)', met: password.length >= 12 },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-white">🔐 Password Strength Builder</h3>
        <p className="mt-2 text-sm text-white/70">Create a password and watch its strength grow in real-time.</p>
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
            {showFeedback ? '🙈 Hide' : '👁️ Show'} Password
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
                    <span className={`text-lg ${check.met ? 'text-green-400' : 'text-white/30'}`}>
                      {check.met ? '✓' : '○'}
                    </span>
                    <span className={`text-sm ${check.met ? 'text-white' : 'text-white/50'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {strength >= 90 && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 animate-fadeIn">
                <p className="text-sm text-green-300">
                  🎉 Excellent! This password is strong and secure. Remember to never reuse it across different sites.
                </p>
              </div>
            )}
          </>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
          <p className="font-semibold text-white/80 mb-2">💡 Pro Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Use a unique password for every account</li>
            <li>Consider using a passphrase (4+ random words)</li>
            <li>Store passwords in a password manager</li>
            <li>Never share your passwords with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordBuilder;
