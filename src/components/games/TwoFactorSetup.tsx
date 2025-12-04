import { useState, useEffect } from 'react';

const TwoFactorSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [verified, setVerified] = useState(false);

  // Generate a random 6-digit code
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Initialize with a code
  useEffect(() => {
    setGeneratedCode(generateCode());
  }, []);

  // Timer countdown
  useEffect(() => {
    if (step === 2 && timeLeft > 0 && !verified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGeneratedCode(generateCode());
      setTimeLeft(30);
      setCode('');
    }
  }, [timeLeft, step, verified]);

  const handleVerify = () => {
    if (code === generatedCode) {
      setVerified(true);
    } else {
      alert('Incorrect code! Check the authenticator app again.');
      setCode('');
    }
  };

  const handleRestart = () => {
    setStep(1);
    setCode('');
    setGeneratedCode(generateCode());
    setTimeLeft(30);
    setVerified(false);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-white">Two-Factor Authentication Setup</h3>
        <p className="mt-2 text-sm text-white/70">Learn how to enable 2FA and protect your accounts with an extra layer of security.</p>
      </div>

      <div className="space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm ${
                step >= s ? 'border-glow-amber bg-glow-amber text-black' : 'border-white/30 bg-transparent text-white/50'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-glow-amber' : 'bg-white/20'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Method */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h4 className="font-semibold text-white mb-3">Choose Your 2FA Method</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full rounded-lg border border-glow-amber/50 bg-glow-amber/10 p-4 text-left hover:bg-glow-amber/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-glow-amber/20 flex items-center justify-center text-glow-amber font-bold">A</div>
                    <div>
                      <p className="font-semibold text-white">Authenticator App</p>
                      <p className="text-xs text-white/60 mt-1">Recommended: Use apps like Google Authenticator or Authy</p>
                    </div>
                  </div>
                </button>

                <div className="w-full rounded-lg border border-white/20 bg-white/5 p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 font-bold">S</div>
                    <div>
                      <p className="font-semibold text-white">SMS Text Message</p>
                      <p className="text-xs text-white/60 mt-1">Less secure: Can be intercepted</p>
                    </div>
                  </div>
                </div>

                <div className="w-full rounded-lg border border-white/20 bg-white/5 p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 font-bold">H</div>
                    <div>
                      <p className="font-semibold text-white">Hardware Security Key</p>
                      <p className="text-xs text-white/60 mt-1">Most secure: Requires physical device like YubiKey</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Setup Authenticator */}
        {step === 2 && !verified && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center">
              <p className="text-sm text-white/70 mb-4">Scan this QR code with your authenticator app</p>
              <div className="inline-block p-4 bg-white rounded-xl">
                <div className="w-32 h-32 bg-black/10 flex items-center justify-center">
                  <span className="text-4xl text-black/40">QR</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-2">Simulated QR Code</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wider text-white/50 mb-2">Authenticator Code (Simulated)</p>
              <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-white/10">
                <span className="font-mono text-2xl font-bold text-glow-amber tracking-wider">{generatedCode}</span>
                <div className="text-right">
                  <div className="text-xs text-white/60">Refreshes in</div>
                  <div className="text-lg font-bold text-white">{timeLeft}s</div>
                </div>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-glow-lime to-glow-amber transition-all duration-1000"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <label className="block text-sm font-medium text-white/80 mb-2">Enter the 6-digit code</label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-center text-2xl font-mono font-bold text-white placeholder-white/40 focus:border-glow-amber focus:outline-none focus:ring-2 focus:ring-glow-amber/50"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={code.length !== 6}
              className="w-full rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-4 py-3 font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Enable 2FA
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {verified && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
              <p className="text-2xl font-semibold text-white mb-2">2FA Enabled!</p>
              <p className="text-sm text-white/70">
                Your account is now protected with two-factor authentication. You'll need your password AND a code from your authenticator app to log in.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h4 className="font-semibold text-white mb-3">Backup Codes</h4>
              <p className="text-xs text-white/60 mb-3">Save these codes in a safe place. Use them if you lose access to your authenticator app.</p>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm text-white/80 bg-black/50 p-3 rounded-lg">
                <div>A1B2-C3D4-E5F6</div>
                <div>G7H8-I9J0-K1L2</div>
                <div>M3N4-O5P6-Q7R8</div>
                <div>S9T0-U1V2-W3X4</div>
                <div>Y5Z6-A7B8-C9D0</div>
                <div>E1F2-G3H4-I5J6</div>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white hover:bg-white/20 transition-all font-semibold"
            >
              ↻ Try Setup Again
            </button>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
          <p className="font-semibold text-white/80 mb-2">Why Use 2FA?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Prevents unauthorized access even if your password is stolen</li>
            <li>Adds an extra layer of protection to your accounts</li>
            <li>Required by many schools and workplaces</li>
            <li>Takes only seconds but dramatically increases security</li>
            <li>Free and works with most major apps and services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
