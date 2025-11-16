import { useState, useRef } from 'react';

type CertificateGeneratorProps = {
  onClose: () => void;
};

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCertificate = () => {
    if (!studentName.trim()) {
      alert('Please enter your name!');
      return;
    }

    setGenerating(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 850;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#a3e635';
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Inner border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 150);

    // Subtitle
    ctx.font = '30px Arial';
    ctx.fillStyle = '#a3e635';
    ctx.fillText('CyberQuest Jr', canvas.width / 2, 200);

    // Award text
    ctx.font = '28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('This is to certify that', canvas.width / 2, 300);

    // Student name
    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(studentName.toUpperCase(), canvas.width / 2, 380);

    // Achievement text
    ctx.font = '26px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('has successfully completed all chapters and challenges', canvas.width / 2, 460);
    ctx.fillText('in the CyberQuest Jr Cybersecurity Training Program', canvas.width / 2, 500);

    // Skills earned
    ctx.font = '22px Arial';
    ctx.fillStyle = '#a3e635';
    ctx.fillText('Master Skills: Password Security • Phishing Detection • Privacy Protection', canvas.width / 2, 580);
    ctx.fillText('Device Security • Rumor Control • Two-Factor Authentication', canvas.width / 2, 615);

    // Date
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(`Awarded on ${today}`, canvas.width / 2, 700);

    // Download
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `CyberQuest-Certificate-${studentName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setGenerating(false);

      setTimeout(() => {
        alert('Certificate downloaded! Share it with your friends and teachers!');
        onClose();
      }, 500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-2xl w-full rounded-3xl border border-white/10 bg-gradient-to-br from-surface-100 to-surface-200 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-white/60 hover:text-white transition-colors"
        >
          ×
        </button>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Congratulations!</h2>
          <p className="text-white/70">
            You have completed all CyberQuest Jr challenges. Enter your name to generate your certificate.
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-white/20 bg-black/30 px-6 py-4 text-center text-xl text-white placeholder-white/40 focus:border-glow-amber focus:outline-none focus:ring-2 focus:ring-glow-amber/50"
              maxLength={50}
            />

            <button
              onClick={generateCertificate}
              disabled={!studentName.trim() || generating}
              className="w-full rounded-xl bg-gradient-to-r from-glow-lime to-glow-amber px-6 py-4 text-lg font-semibold text-black hover:shadow-lg hover:shadow-glow-amber/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating Certificate...' : 'Generate Certificate'}
            </button>
          </div>

          <p className="text-xs text-white/50">
            Your certificate will be downloaded as a PNG image that you can print or share!
          </p>
        </div>

        {/* Hidden canvas for certificate generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CertificateGenerator;
