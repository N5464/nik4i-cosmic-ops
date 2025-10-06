import React from 'react';
import GlyphInfoBox from './GlyphInfoBox';
import { useIsMobile } from '../hooks/useIsMobile';

interface PayloadGlyphProps {
  onClick: () => void;
  glitchActive: boolean;
}

const PayloadGlyph: React.FC<PayloadGlyphProps> = ({ onClick, glitchActive }) => {
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
        className="fixed bottom-8 left-8 group z-50"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <div 
          className={`relative cursor-pointer transition-all duration-700 hover:scale-110 hover:-translate-y-1 ${
            glitchActive ? 'animate-pulse scale-105' : ''
          }`}
          onClick={onClick}
        >
          <div className="relative">
            <div 
              className="w-14 h-14 border-2 border-slate-400 hover:border-emerald-400 transition-all duration-700 backdrop-blur-sm rounded-sm relative overflow-hidden"
              style={{
                background: glitchActive 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))'
                  : 'linear-gradient(135deg, rgba(71, 85, 105, 0.12), rgba(51, 65, 85, 0.08))',
                filter: glitchActive 
                  ? 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))'
                  : 'drop-shadow(0 0 10px rgba(148, 163, 184, 0.4))',
              }}
            >
              {/* Inner Glass Layer */}
              <div 
                className="absolute inset-1 border border-slate-300/40 hover:border-emerald-300/60 transition-all duration-700 backdrop-blur-sm rounded-sm"
                style={{
                  background: glitchActive
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.05))'
                    : 'linear-gradient(135deg, rgba(148, 163, 184, 0.06), rgba(100, 116, 139, 0.04))',
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-8 h-8 transition-all duration-700"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8"
                  style={{
                    color: glitchActive ? '#10B981' : '#64748B',
                    filter: glitchActive 
                      ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 1))'
                      : 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.8))',
                  }}
                >
                  {/* Outer Triangle */}
                  <path d="M20 80 L50 20 L80 80 Z" strokeWidth="6" />
                  {/* Inner Arrow/Chevron */}
                  <path d="M35 55 L50 40 L65 55" strokeWidth="4" />
                  {/* Central Dot */}
                  <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.8" />
                </svg>
              </div>
              
              {/* Subtle Energy Flow Lines */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div 
                  className="absolute top-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-pulse"
                  style={{ animationDuration: '3s' }}
                />
                <div 
                  className="absolute bottom-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent animate-pulse"
                  style={{ animationDuration: '3s', animationDelay: '1.5s' }}
                />
              </div>
            </div>

            <div className={`absolute inset-0 transition-all duration-700 ${
              glitchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div 
                className={`w-14 h-14 border rounded-sm ${
                  glitchActive ? 'border-emerald-300/80 animate-pulse' : 'border-emerald-400/60'
                }`}
                style={{ 
                  filter: glitchActive 
                    ? 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))'
                    : 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))',
                  boxShadow: glitchActive 
                    ? '0 0 12px 2px rgba(16, 185, 129, 0.6)'
                    : '0 0 8px 1px rgba(16, 185, 129, 0.4)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {!isMobile && (
        <GlyphInfoBox
          title="PAYLOAD DECK"
          description="Tactical operations center. Access to Dual Blade Intel, ZipStash secure vault."
          classification="ALPHA"
          accessLevel="OPERATOR"
          position="bottom-left"
          isVisible={showInfo}
          glyphPosition={glyphPosition}
        />
      )}
    </>
  );
};

export default PayloadGlyph;