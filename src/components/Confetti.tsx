import { useEffect, useState } from 'react';

type ConfettiPiece = {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  color: string;
  rotation: number;
};

const Confetti: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({ trigger, onComplete }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#a3e635', '#fbbf24', '#fb923c', '#f472b6', '#60a5fa', '#34d399'];
    const newPieces: ConfettiPiece[] = [];

    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 2,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      });
    }

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            animationDuration: `${piece.animationDuration}s`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
