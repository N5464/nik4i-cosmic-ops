import React from 'react';

interface BunkerGlyphProps {
  onClick: () => void;
  glitchActive: boolean;
}

const BunkerGlyph: React.FC<BunkerGlyphProps> = ({ onClick, glitchActive }) => {
  return (
    <div className="fixed bottom-6 right-6 group z-50">
      <div 
        className={`relative cursor-pointer transition-all duration-700 hover:scale-110 hover:-translate-y-1 ${
          glitchActive ? 'animate-pulse scale-105' : ''
        }`}
        onClick={onClick}
      >
        {/* Main Glyph Container */}
        <div className="relative">
          {/* Outer Container with Cutouts */}
          <div 
            className="w-14 h-14 border-2 border-slate-400/50 hover:border-slate-300/70 transition-all duration-700 backdrop-blur-sm relative overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              background: glitchActive 
                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(100, 116, 139, 0.15))'
                : 'linear-gradient(135deg, rgba(71, 85, 105, 0.15), rgba(51, 65, 85, 0.1))',
              filter: glitchActive 
                ? 'drop-shadow(0 0 20px rgba(148, 163, 184, 0.8))'
                : 'drop-shadow(0 0 15px rgba(148, 163, 184, 0.6))',
            }}
          >
            {/* Inner Glass Layer */}
            <div 
              className="absolute inset-1 border border-slate-300/40 hover:border-slate-200/60 transition-all duration-700 backdrop-blur-sm"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                background: glitchActive
                  ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.08), rgba(100, 116, 139, 0.05))'
                  : 'linear-gradient(135deg, rgba(100, 116, 139, 0.06), rgba(71, 85, 105, 0.04))',
              }}
            />
            
            {/* Secure Vault Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 40 40" 
                className="w-8 h-8 transition-all duration-700 group-hover:scale-110"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                style={{
                  color: glitchActive ? '#cbd5e1' : '#94a3b8',
                  filter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 1))',
                }}
              >
                {/* Vault Door Frame */}
                <rect 
                  x="8" 
                  y="12" 
                  width="24" 
                  height="20" 
                  rx="2" 
                  strokeWidth="2"
                  className="animate-pulse"
                  style={{ 
                    opacity: 0.8,
                    animationDuration: '3s' 
                  }}
                />
                
                {/* Vault Lock Mechanism */}
                <circle 
                  cx="20" 
                  cy="22" 
                  r="4" 
                  strokeWidth="1.5"
                  className="animate-pulse"
                  style={{ 
                    opacity: 0.9,
                    animationDuration: '2.5s',
                    animationDelay: '0.3s' 
                  }}
                />
                
                {/* Central Lock Core */}
                <circle 
                  cx="20" 
                  cy="22" 
                  r="1.5" 
                  fill="currentColor"
                  className="animate-pulse"
                  style={{ 
                    opacity: 1,
                    animationDuration: '2s',
                    animationDelay: '0.5s' 
                  }}
                />
                
                {/* Security Bolts */}
                <g className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.2s' }}>
                  <circle cx="12" cy="16" r="1" fill="currentColor" opacity="0.7" />
                  <circle cx="28" cy="16" r="1" fill="currentColor" opacity="0.6" />
                  <circle cx="12" cy="28" r="1" fill="currentColor" opacity="0.5" />
                  <circle cx="28" cy="28" r="1" fill="currentColor" opacity="0.4" />
                </g>
                
                {/* Vault Handle */}
                <path 
                  d="M26 22 L30 22" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-pulse"
                  style={{ 
                    opacity: 0.6,
                    animationDuration: '3.5s',
                    animationDelay: '0.8s' 
                  }}
                />
                
                {/* Security Grid Lines */}
                <path 
                  d="M14 18 L26 18 M14 26 L26 26" 
                  strokeWidth="0.5"
                  className="animate-pulse"
                  style={{ 
                    opacity: 0.4,
                    animationDuration: '3.5s',
                    animationDelay: '1.2s' 
                  }}
                />
              </svg>
            </div>

            {/* Hover/Glitch Glow Effect */}
            <div className={`absolute inset-0 transition-all duration-700 ${
              glitchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div 
                className={`w-14 h-14 border animate-pulse ${
                  glitchActive ? 'border-slate-300/80' : 'border-slate-400/70'
                }`}
                style={{ 
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  filter: 'drop-shadow(0 0 25px rgba(148, 163, 184, 0.8))',
                  boxShadow: '0 0 15px 2px rgba(148, 163, 184, 0.6)'
                }}
              />
            </div>

            {/* Subtle Energy Flow Lines */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div 
                className="absolute top-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent animate-pulse"
                style={{ animationDuration: '3s' }}
              />
              <div 
                className="absolute bottom-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent animate-pulse"
                style={{ animationDuration: '3s', animationDelay: '1.5s' }}
              />
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div 
                className="w-full h-full bg-gradient-to-br from-slate-400/20 via-transparent to-slate-500/20 animate-pulse"
                style={{ 
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  animationDuration: '4s'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BunkerGlyph;