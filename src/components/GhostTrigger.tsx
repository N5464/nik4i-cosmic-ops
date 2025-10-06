import React from 'react';
import GlyphInfoBox from './GlyphInfoBox';
import { useIsMobile } from '../hooks/useIsMobile';

interface GhostTriggerProps {
  onClick: () => void;
  glitchActive: boolean;
}

const GhostTrigger: React.FC<GhostTriggerProps> = ({ onClick, glitchActive }) => {
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
      className="fixed top-8 left-8 group z-50"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div 
        className={`relative cursor-pointer transition-all duration-700 hover:scale-110 hover:-translate-y-1 ${
          glitchActive ? 'animate-pulse scale-105' : ''
        }`}
        onClick={onClick}
      >
        {/* Glyph Container */}
        <div className="relative">
          {/* Outer Triangle Border */}
          <div 
            className="w-14 h-14 border-2 border-cyan-400 hover:border-red-400 transition-all duration-700 backdrop-blur-sm hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] hover:hover:shadow-[0_0_35px_rgba(239,68,68,0.8)]"
            style={{
              clipPath: 'polygon(50% 85%, 15% 25%, 85% 25%)',
              background: glitchActive 
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(14, 165, 233, 0.1))',
              filter: glitchActive 
                ? 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.8))'
                : 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.8))',
            }}
          />
          
          {/* Inner Glass Layer */}
          <div 
            className="absolute inset-1 border border-cyan-300/60 hover:border-red-300/60 transition-all duration-700 backdrop-blur-sm"
            style={{
              clipPath: 'polygon(50% 85%, 15% 25%, 85% 25%)',
              background: glitchActive
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05))'
                : 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(14, 165, 233, 0.05))',
            }}
          />
          
          {/* Inner Glyph Symbol - Hollow Triangle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-6 h-6 border-2 transition-all duration-700 group-hover:scale-110 ${
                  glitchActive 
                    ? 'border-red-300 group-hover:border-red-200' 
                    : 'border-cyan-300 group-hover:border-cyan-200'
                }`}
                style={{ 
                  clipPath: 'polygon(50% 80%, 20% 30%, 80% 30%)',
                  filter: glitchActive
                    ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 1))'
                    : 'drop-shadow(0 0 8px rgba(6, 182, 212, 1))',
                }}
              />
            </div>
          </div>

          {/* Hover/Glitch Glow Effect */}
          <div className={`absolute inset-0 transition-all duration-700 ${
            glitchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div 
              className={`w-14 h-14 border animate-pulse ${
                glitchActive ? 'border-red-400/70' : 'border-cyan-400/70'
              }`}
              style={{ clipPath: 'polygon(50% 85%, 15% 25%, 85% 25%)' }}
            />
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
            <div 
              className="w-14 h-14 bg-gradient-to-br from-cyan-400/20 via-transparent to-red-400/20 animate-pulse"
              style={{ clipPath: 'polygon(50% 85%, 15% 25%, 85% 25%)' }}
            />
          </div>
        </div>

      </div>
    </div>

    {!isMobile && (
      <GlyphInfoBox
        title="GHOST TRIGGER"
        description="Arcane breach protocol initiator. Awakens the phantom realm gateway for shadow operations and forbidden knowledge extraction."
        classification="OMEGA"
        accessLevel="VOID CLEARANCE"
        position="top-left"
        isVisible={showInfo}
        glyphPosition={glyphPosition}
      />
    )}
    </>
  );
};

export default GhostTrigger;