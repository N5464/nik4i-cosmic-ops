import React, { useEffect } from 'react';

interface LoadingTunnelProps {
  isVisible: boolean;
  onComplete: () => void;
}

const LoadingTunnel: React.FC<LoadingTunnelProps> = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Glassy Tunnel Background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `
            radial-gradient(circle at center, 
              rgba(55, 65, 81, 0.95) 0%, 
              rgba(31, 41, 55, 0.98) 40%, 
              rgba(17, 24, 39, 1) 70%,
              rgba(0, 0, 0, 1) 100%
            )
          `,
        }}
      >
        {/* Subtle Glass Rings */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-slate-400/20 rounded-full animate-pulse"
              style={{
                left: '50%',
                top: '50%',
                width: `${(i + 1) * 150}px`,
                height: `${(i + 1) * 150}px`,
                marginLeft: `-${(i + 1) * 75}px`,
                marginTop: `-${(i + 1) * 75}px`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: '2s',
                background: 'rgba(148, 163, 184, 0.05)',
                backdropFilter: 'blur(1px)',
              }}
            />
          ))}
        </div>

        {/* Minimal Scanning Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-slate-400/10 to-transparent h-px animate-pulse"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: '0',
                right: '0',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        {/* Subtle Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-slate-300/20 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-slate-400/40 border-t-slate-300 rounded-full animate-spin"></div>
        <div className="text-slate-300 font-mono text-sm tracking-wider animate-pulse">
          INITIALIZING PAYLOAD DECK...
        </div>
      </div>
    </div>
  );
};

export default LoadingTunnel;