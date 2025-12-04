import { useState } from 'react';

type Setting = {
  id: string;
  label: string;
  description: string;
  currentValue: 'public' | 'friends' | 'private';
  recommendedValue: 'friends' | 'private';
};

const PrivacyAudit: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: 'profile',
      label: 'Profile Visibility',
      description: 'Who can see your profile and posts',
      currentValue: 'public',
      recommendedValue: 'friends',
    },
    {
      id: 'email',
      label: 'Email Address',
      description: 'Who can see your email on your profile',
      currentValue: 'public',
      recommendedValue: 'private',
    },
    {
      id: 'phone',
      label: 'Phone Number',
      description: 'Who can see your phone number',
      currentValue: 'friends',
      recommendedValue: 'private',
    },
    {
      id: 'location',
      label: 'Location Sharing',
      description: 'Who can see your current location',
      currentValue: 'public',
      recommendedValue: 'private',
    },
    {
      id: 'photos',
      label: 'Photo Tagging',
      description: 'Who can tag you in photos',
      currentValue: 'public',
      recommendedValue: 'friends',
    },
    {
      id: 'search',
      label: 'Search Visibility',
      description: 'Can search engines find your profile',
      currentValue: 'public',
      recommendedValue: 'private',
    },
  ]);

  const [showResults, setShowResults] = useState(false);

  const updateSetting = (id: string, value: 'public' | 'friends' | 'private') => {
    setSettings(settings.map(s => s.id === id ? { ...s, currentValue: value } : s));
    setShowResults(false);
  };

  const auditResults = settings.map(s => ({
    ...s,
    isSecure: s.currentValue === s.recommendedValue ||
              (s.recommendedValue === 'friends' && s.currentValue === 'private'),
  }));

  const secureCount = auditResults.filter(r => r.isSecure).length;
  const totalCount = settings.length;
  const scorePercent = Math.round((secureCount / totalCount) * 100);

  const handleAudit = () => {
    setShowResults(true);
  };

  const handleAutoFix = () => {
    setSettings(settings.map(s => ({ ...s, currentValue: s.recommendedValue })));
    setShowResults(true);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-white">Privacy Settings Audit</h3>
        <p className="mt-2 text-sm text-white/70">Review your social media privacy settings and lock down your digital footprint.</p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => {
          const result = auditResults.find(r => r.id === setting.id);
          const showBadge = showResults && result;

          return (
            <div key={setting.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{setting.label}</h4>
                    {showBadge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${result.isSecure ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {result.isSecure ? 'Secure' : 'Exposed'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 mt-1">{setting.description}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting(setting.id, 'public')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    setting.currentValue === 'public'
                      ? 'bg-red-500/20 border-2 border-red-500 text-red-300'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Public
                </button>
                <button
                  onClick={() => updateSetting(setting.id, 'friends')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    setting.currentValue === 'friends'
                      ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-300'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Friends
                </button>
                <button
                  onClick={() => updateSetting(setting.id, 'private')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    setting.currentValue === 'private'
                      ? 'bg-green-500/20 border-2 border-green-500 text-green-300'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Private
                </button>
              </div>
            </div>
          );
        })}

        <div className="flex gap-3">
          <button
            onClick={handleAudit}
            className="flex-1 rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-4 py-3 font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all"
          >
            Run Privacy Audit
          </button>
          <button
            onClick={handleAutoFix}
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white hover:bg-white/20 transition-all font-semibold"
          >
            Auto-Fix All
          </button>
        </div>

        {showResults && (
          <div className={`rounded-xl border p-4 animate-fadeIn ${
            scorePercent === 100 ? 'border-green-500/30 bg-green-500/10' :
            scorePercent >= 70 ? 'border-yellow-500/30 bg-yellow-500/10' :
            'border-red-500/30 bg-red-500/10'
          }`}>
            <p className="text-lg font-semibold text-white mb-2">Audit Results</p>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full transition-all duration-500 ${
                      scorePercent === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      scorePercent >= 70 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                      'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">{scorePercent}%</span>
            </div>
            <p className="text-sm text-white/80">
              {secureCount} of {totalCount} settings are secure.{' '}
              {scorePercent === 100 ? 'Perfect! Your privacy is locked down.' :
               scorePercent >= 70 ? 'Good progress! Fix the remaining settings.' :
               'Your information is too exposed. Tighten your privacy settings.'}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
          <p className="font-semibold text-white/80 mb-2">Privacy Best Practices:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Review privacy settings on all social media accounts</li>
            <li>Limit who can see your personal information</li>
            <li>Turn off location sharing when not needed</li>
            <li>Control who can tag you in photos</li>
            <li>Disable search engine indexing of your profile</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAudit;
