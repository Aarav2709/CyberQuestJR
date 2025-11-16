import { useState } from 'react';

type SecurityItem = {
  id: string;
  name: string;
  status: 'updated' | 'outdated' | 'unknown';
  version: string;
  latestVersion: string;
};

const DeviceSecurityChecker: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [items, setItems] = useState<SecurityItem[]>([
    { id: 'os', name: 'Operating System', status: 'unknown', version: '???', latestVersion: '14.2' },
    { id: 'browser', name: 'Web Browser', status: 'unknown', version: '???', latestVersion: '120.0' },
    { id: 'antivirus', name: 'Antivirus Software', status: 'unknown', version: '???', latestVersion: '2024.11' },
    { id: 'apps', name: 'Installed Apps', status: 'unknown', version: '???', latestVersion: 'Various' },
    { id: 'firewall', name: 'Firewall', status: 'unknown', version: '???', latestVersion: 'Active' },
  ]);

  const startScan = () => {
    setScanning(true);
    setScanComplete(false);

    // Simulate scanning with random results
    setTimeout(() => {
      const newItems: SecurityItem[] = [
        { id: 'os', name: 'Operating System', status: Math.random() > 0.3 ? 'updated' : 'outdated', version: '14.1', latestVersion: '14.2' },
        { id: 'browser', name: 'Web Browser', status: Math.random() > 0.3 ? 'updated' : 'outdated', version: '119.0', latestVersion: '120.0' },
        { id: 'antivirus', name: 'Antivirus Software', status: Math.random() > 0.5 ? 'updated' : 'outdated', version: '2024.10', latestVersion: '2024.11' },
        { id: 'apps', name: 'Installed Apps', status: Math.random() > 0.4 ? 'updated' : 'outdated', version: '12 apps', latestVersion: 'Various' },
        { id: 'firewall', name: 'Firewall', status: 'updated', version: 'Active', latestVersion: 'Active' },
      ];
      setItems(newItems);
      setScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  const updateItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status: 'updated' as const, version: item.latestVersion } : item
    ));
  };

  const updateAll = () => {
    setItems(items.map(item => ({ ...item, status: 'updated' as const, version: item.latestVersion })));
  };

  const outdatedCount = items.filter(i => i.status === 'outdated').length;
  const updatedCount = items.filter(i => i.status === 'updated').length;
  const totalCount = items.length;
  const scorePercent = scanComplete ? Math.round((updatedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100/90 to-surface-200/80 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-white">🛡️ Device Security Checker</h3>
        <p className="mt-2 text-sm text-white/70">Scan your device for outdated software and security vulnerabilities.</p>
      </div>

      <div className="space-y-4">
        {!scanComplete && !scanning && (
          <button
            onClick={startScan}
            className="w-full rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-4 py-3 font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all"
          >
            🔍 Start Security Scan
          </button>
        )}

        {scanning && (
          <div className="rounded-xl border border-white/10 bg-black/20 p-6 text-center animate-fadeIn">
            <div className="mb-4">
              <div className="inline-block animate-spin text-4xl">🔄</div>
            </div>
            <p className="text-lg font-semibold text-white mb-2">Scanning Your Device...</p>
            <p className="text-sm text-white/60">Checking for updates and vulnerabilities</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 animate-pulse bg-gradient-to-r from-glow-lime to-glow-amber" />
            </div>
          </div>
        )}

        {scanComplete && (
          <div className="space-y-4 animate-fadeIn">
            <div className={`rounded-xl border p-4 ${
              scorePercent === 100 ? 'border-green-500/30 bg-green-500/10' :
              scorePercent >= 60 ? 'border-yellow-500/30 bg-yellow-500/10' :
              'border-red-500/30 bg-red-500/10'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-semibold text-white">Security Score</p>
                  <p className="text-xs text-white/60">{updatedCount} of {totalCount} items up to date</p>
                </div>
                <div className="text-3xl font-bold text-white">{scorePercent}%</div>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full transition-all duration-500 ${
                    scorePercent === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    scorePercent >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                    'bg-gradient-to-r from-red-500 to-orange-500'
                  }`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      {item.status === 'updated' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">✓ Updated</span>
                      )}
                      {item.status === 'outdated' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">⚠️ Outdated</span>
                      )}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {item.status === 'updated' ? (
                        <span>Current: {item.version}</span>
                      ) : (
                        <span>Current: {item.version} → Latest: {item.latestVersion}</span>
                      )}
                    </div>
                  </div>
                  {item.status === 'outdated' && (
                    <button
                      onClick={() => updateItem(item.id)}
                      className="rounded-lg bg-glow-amber px-3 py-1.5 text-xs font-semibold text-black hover:shadow-lg transition-all"
                    >
                      Update Now
                    </button>
                  )}
                </div>
              </div>
            ))}

            {outdatedCount > 0 && (
              <button
                onClick={updateAll}
                className="w-full rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-4 py-3 font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all"
              >
                🚀 Update All ({outdatedCount} items)
              </button>
            )}

            {scorePercent === 100 && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-green-300 font-semibold">🎉 Perfect! Your device is fully protected.</p>
              </div>
            )}

            <button
              onClick={startScan}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white hover:bg-white/20 transition-all font-semibold"
            >
              ↻ Scan Again
            </button>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
          <p className="font-semibold text-white/80 mb-2">🔧 Device Security Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Enable automatic updates for your OS and apps</li>
            <li>Keep your antivirus software up to date</li>
            <li>Update apps as soon as new versions are available</li>
            <li>Uninstall apps you no longer use</li>
            <li>Enable firewall protection on all devices</li>
            <li>Restart your device regularly to apply updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeviceSecurityChecker;
