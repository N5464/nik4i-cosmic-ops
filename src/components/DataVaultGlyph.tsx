import React from 'react';
import GlyphInfoBox from './GlyphInfoBox';
import { useIsMobile } from '../hooks/useIsMobile';

interface DataVaultGlyphProps {
  onClick: () => void;
  glitchActive: boolean;
}

const DataVaultGlyph: React.FC<DataVaultGlyphProps> = ({ onClick, glitchActive }) => {
  const [showInfo, setShowInfo] = React.useState(false);
  const [glyphPosition, setGlyphPosition] = React.useState({ x: 0, y: 0 });
  const glyphRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (glyphRef.current) {
      const rect = glyphRef.current.getBoundingClientRect();
      setGlyphPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  }, []);
  return (
    <>
    <div 
      ref={glyphRef}
      className="fixed top-8 right-8 group z-50"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div 
        className={`relative cursor-pointer transition-all duration-700 hover:scale-110 hover:-translate-y-1 ${
          glitchActive ? 'animate-pulse scale-105' : ''
        }`}
        onClick={onClick}
      >
        {/* Main Quantum Archive Container */}
        <div className="relative">
          {/* Outer Container - Octagonal for quantum feel */}
          <div 
            className="w-14 h-14 border border-gray-700 hover:border-amber-400 transition-all duration-700 backdrop-blur-sm relative overflow-hidden"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              background: glitchActive 
                ? 'linear-gradient(135deg, rgba(71, 85, 105, 0.3), rgba(51, 65, 85, 0.25))'
                : 'linear-gradient(135deg, rgba(71, 85, 105, 0.15), rgba(51, 65, 85, 0.1))',
              filter: glitchActive 
                ? 'drop-shadow(0 0 25px rgba(100, 116, 139, 0.8))'
                : 'drop-shadow(0 0 20px rgba(100, 116, 139, 0.6))',
            }}
          />
          
          {/* Inner Quantum Layer */}
          <div 
            className="absolute inset-1 border border-slate-400/50 hover:border-slate-300/70 transition-all duration-700 backdrop-blur-sm"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              background: glitchActive
                ? 'linear-gradient(135deg, rgba(71, 85, 105, 0.15), rgba(51, 65, 85, 0.1))'
                : 'linear-gradient(135deg, rgba(71, 85, 105, 0.08), rgba(51, 65, 85, 0.05))',
            }}
          />
          
          {/* Quantum Archive Symbol - Multi-layered Data Matrix */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              viewBox="0 0 40 40" 
              className="w-8 h-8 transition-all duration-700 group-hover:scale-110"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2"
              style={{
                color: glitchActive ? '#94A3B8' : '#64748B',
                filter: 'drop-shadow(0 0 10px rgba(100, 116, 139, 1))',
              }}
            >
              {/* Outer Quantum Frame */}
              <polygon 
                points="20,4 32,12 32,28 20,36 8,28 8,12" 
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-pulse"
                style={{ 
                  opacity: 0.8,
                  animationDuration: '3s' 
                }}
              />
              
              {/* Inner Data Core */}
              <polygon 
                points="20,8 28,14 28,26 20,32 12,26 12,14" 
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="animate-pulse"
                style={{ 
                  opacity: 0.9,
                  animationDuration: '2.5s',
                  animationDelay: '0.3s' 
                }}
              />
              
              {/* Central Quantum Core */}
              <circle 
                cx="20" 
                cy="20" 
                r="4" 
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="animate-pulse"
                style={{ 
                  opacity: 1,
                  animationDuration: '2s',
                  animationDelay: '0.5s' 
                }}
              />
              
              {/* Dynamic Data Streams */}
              <g className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.2s' }}>
                <line x1="20" y1="8" x2="20" y2="14" strokeWidth="0.8" opacity="0.7" />
                <line x1="28" y1="14" x2="24" y2="18" strokeWidth="0.8" opacity="0.6" />
                <line x1="28" y1="26" x2="24" y2="22" strokeWidth="0.8" opacity="0.5" />
                <line x1="20" y1="32" x2="20" y2="26" strokeWidth="0.8" opacity="0.4" />
                <line x1="12" y1="26" x2="16" y2="22" strokeWidth="0.8" opacity="0.3" />
                <line x1="12" y1="14" x2="16" y2="18" strokeWidth="0.8" opacity="0.2" />
              </g>
              
              {/* Quantum Flow Lines */}
              <path 
                d="M14 16 Q20 12 26 16 Q20 20 14 16" 
                fill="none"
                strokeWidth="0.6"
                className="animate-pulse"
                style={{ 
                  opacity: 0.6,
                  animationDuration: '3.5s',
                  animationDelay: '0.8s' 
                }}
              />
              <path 
                d="M14 24 Q20 28 26 24 Q20 20 14 24" 
                fill="none"
                strokeWidth="0.6"
                className="animate-pulse"
                style={{ 
                  opacity: 0.5,
                  animationDuration: '3.5s',
                  animationDelay: '1.2s' 
                }}
              />
              
              {/* Central Quantum Pulse */}
              <circle 
                cx="20" 
                cy="20" 
                r="1.5" 
                fill="currentColor"
                className="animate-pulse"
                style={{ 
                  opacity: 0.9,
                  animationDuration: '1.5s' 
                }}
              />
            </svg>
          </div>

          {/* Hover/Glitch Quantum Effect */}
          <div className={`absolute inset-0 transition-all duration-700 ${
            glitchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div 
              className="w-14 h-14"
              style={{ 
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                filter: glitchActive 
                  ? 'drop-shadow(0 0 30px rgba(100, 116, 139, 0.9))'
                  : 'drop-shadow(0 0 25px rgba(100, 116, 139, 0.8))',
              }}
            />
          </div>

          {/* Subtle Quantum Gradient Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
            <div 
              className="w-full h-full bg-gradient-to-br from-slate-400/30 via-slate-500/20 to-slate-600/10 animate-pulse"
              style={{ 
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                animationDuration: '4s'
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {!isMobile && (
      <GlyphInfoBox
        title="DATA VAULT ARCHIVE"
        description="Operator archive. Contains documented build ops, mission briefs, deployed systems, and work logs."
        classification="BETA"
        accessLevel="CLASSIFIED"
        position="top-right"
        isVisible={showInfo}
        glyphPosition={glyphPosition}
      />
    )}
    </>
  );
};

export default DataVaultGlyph;