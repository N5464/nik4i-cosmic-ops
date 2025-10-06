import React from 'react';

interface GlyphInfoBoxProps {
  title: string;
  description: string;
  classification: 'ALPHA' | 'BETA' | 'GAMMA' | 'OMEGA';
  accessLevel: 'OPERATOR' | 'CLASSIFIED' | 'TOP SECRET';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isVisible: boolean;
  glyphPosition: { x: number; y: number };
}

const GlyphInfoBox: React.FC<GlyphInfoBoxProps> = ({ 
  title, 
  description, 
  classification,
  accessLevel,
  threatLevel,
  position,
  isVisible,
  glyphPosition
}) => {
  const getClassificationColor = () => {
    switch (classification) {
      case 'ALPHA': return 'border-slate-400/60 bg-slate-950/20 text-slate-300';
      case 'BETA': return 'border-cyan-400/60 bg-cyan-950/20 text-cyan-300';
      case 'GAMMA': return 'border-amber-400/60 bg-amber-950/20 text-amber-300';
      case 'OMEGA': return 'border-pink-400/60 bg-pink-950/20 text-pink-300';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-20 left-20 origin-bottom-right';
      case 'top-right':
        return 'top-20 right-20 origin-bottom-left';
      case 'bottom-left':
        return 'bottom-20 left-20 origin-top-right';
      case 'bottom-right':
        return 'bottom-20 right-20 origin-top-left';
    }
  };

  const getSlideDirection = () => {
    switch (position) {
      case 'top-left':
        return 'translate-x-8 -translate-y-8';
      case 'top-right':
        return '-translate-x-8 -translate-y-8';
      case 'bottom-left':
        return 'translate-x-8 translate-y-8';
      case 'bottom-right':
        return '-translate-x-8 translate-y-8';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Neural Connection Line */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.8)" />
              <stop offset="50%" stopColor="rgba(6, 182, 212, 0.4)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
            </linearGradient>
          </defs>
          <line
            x1={glyphPosition.x}
            y1={glyphPosition.y}
            x2={position.includes('right') ? window.innerWidth - 320 : 320}
            y2={position.includes('top') ? 120 : window.innerHeight - 120}
            stroke="url(#neuralGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          {/* Neural pulse dots */}
          <circle
            cx={glyphPosition.x}
            cy={glyphPosition.y}
            r="3"
            fill="rgba(6, 182, 212, 0.8)"
            className="animate-ping"
          />
        </svg>
      </div>

      {/* HUD Info Panel */}
      <div 
        className={`fixed z-50 ${getPositionClasses()} transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 scale-100 translate-x-0 translate-y-0' 
            : `opacity-0 scale-75 ${getSlideDirection()}`
        }`}
      >
        <div 
          className={`w-80 border-2 backdrop-blur-md relative overflow-hidden ${getClassificationColor()}`}
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Scanning Lines Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"
              style={{ 
                animation: 'scanline 3s linear infinite',
              }}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse"
              style={{ 
                animation: 'scanline 3s linear infinite reverse',
                animationDelay: '1.5s'
              }}
            />
          </div>

          {/* Header */}
          <div className="border-b border-current/30 p-3 bg-black/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <span className="font-mono text-xs font-bold tracking-wider">
                  NEURAL HUD
                </span>
              </div>
              <div className="font-mono text-xs opacity-60">
                {classification}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div>
              <div className="font-mono text-xs text-current/60 mb-1">TARGET DESIGNATION:</div>
              <div className="font-mono text-sm font-bold tracking-wide">
                {title}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="font-mono text-xs text-current/60 mb-1">TACTICAL BRIEF:</div>
              <div className="font-mono text-xs leading-relaxed opacity-90">
                {description}
              </div>
            </div>

            {/* Metadata Grid */}
          </div>

          {/* Corner Indicators */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-current/40 animate-pulse"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-current/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-current/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-current/40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default GlyphInfoBox;