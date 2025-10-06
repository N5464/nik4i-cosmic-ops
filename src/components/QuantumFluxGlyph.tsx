import React from 'react';
import GlyphInfoBox from './GlyphInfoBox';
import { useIsMobile } from '../hooks/useIsMobile';

interface QuantumFluxGlyphProps {
  onClick: () => void;
  glitchActive: boolean;
}

const QuantumFluxGlyph: React.FC<QuantumFluxGlyphProps> = ({ onClick, glitchActive }) => {
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
      className="fixed bottom-8 right-8 group z-50"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div 
        className={`relative cursor-pointer transition-all duration-700 hover:scale-110 hover:-translate-y-1 ${
          glitchActive ? 'animate-pulse scale-105' : ''
        }`}
        onClick={onClick}
      >
        {/* Main Glyph Container */}
        <div className="relative">
          {/* Outer Container */}
          <div 
            className="w-14 h-14 border-2 border-purple-400 hover:border-purple-300 transition-all duration-700 backdrop-blur-sm rounded-full relative overflow-hidden"
            style={{
              background: glitchActive 
                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.15))'
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.08))',
              filter: glitchActive 
                ? 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))'
                : 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.6))',
            }}
          >
            {/* Inner Glass Layer */}
            <div 
              className="absolute inset-1 border border-purple-300/60 hover:border-purple-200/80 transition-all duration-700 backdrop-blur-sm rounded-full"
              style={{
                background: glitchActive
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(147, 51, 234, 0.05))'
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(147, 51, 234, 0.03))',
              }}
            />
            
            {/* Quantum Flux Symbol - Oscillating Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 40 40" 
                className="w-8 h-8 transition-all duration-700 group-hover:scale-110"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                style={{
                  color: glitchActive ? '#c4b5fd' : '#a855f7',
                  filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 1))',
                }}
              >
                {/* Outer Ring - Slow Rotation */}
                <circle 
                  cx="20" 
                  cy="20" 
                  r="16" 
                  className="animate-spin" 
                  style={{ 
                    animationDuration: '8s',
                    strokeDasharray: '20 10',
                    opacity: 0.6 
                  }} 
                />
                
                {/* Middle Ring - Medium Rotation */}
                <circle 
                  cx="20" 
                  cy="20" 
                  r="11" 
                  className="animate-spin" 
                  style={{ 
                    animationDuration: '5s',
                    animationDirection: 'reverse',
                    strokeDasharray: '15 8',
                    opacity: 0.8 
                  }} 
                />
                
                {/* Inner Ring - Fast Rotation */}
                <circle 
                  cx="20" 
                  cy="20" 
                  r="6" 
                  className="animate-spin" 
                  style={{ 
                    animationDuration: '3s',
                    strokeDasharray: '10 5',
                    opacity: 1 
                  }} 
                />
                
                {/* Central Flux Point */}
                <circle 
                  cx="20" 
                  cy="20" 
                  r="2" 
                  fill="currentColor"
                  className="animate-pulse"
                  style={{ opacity: 0.9 }}
                />
                
                {/* Quantum Flux Lines */}
                <path 
                  d="M8 20 Q20 8 32 20 Q20 32 8 20" 
                  fill="none"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ 
                    opacity: 0.4,
                    animationDuration: '2s' 
                  }}
                />
                <path 
                  d="M20 8 Q32 20 20 32 Q8 20 20 8" 
                  fill="none"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ 
                    opacity: 0.4,
                    animationDuration: '2.5s',
                    animationDelay: '0.5s' 
                  }}
                />
              </svg>
            </div>

            {/* Hover/Glitch Glow Effect */}
            <div className={`absolute inset-0 transition-all duration-700 rounded-full ${
              glitchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div 
                className={`w-14 h-14 border rounded-full animate-pulse ${
                  glitchActive ? 'border-purple-300/70' : 'border-purple-400/70'
                }`}
                style={{ 
                  filter: 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.8))',
                  boxShadow: '0 0 15px 2px rgba(168, 85, 247, 0.6)'
                }}
              />
            </div>

            {/* Quantum Energy Particles */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-300/60 rounded-full animate-pulse"
                  style={{
                    top: `${20 + 25 * Math.cos((i * 60) * Math.PI / 180)}px`,
                    left: `${20 + 25 * Math.sin((i * 60) * Math.PI / 180)}px`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${2 + Math.random()}s`,
                  }}
                />
              ))}
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-full">
              <div 
                className="w-full h-full bg-gradient-to-br from-purple-400/20 via-transparent to-violet-400/20 animate-pulse rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {!isMobile && (
      <GlyphInfoBox
        title="QUANTUM FLUX MATRIX"
        description="Operator profile neural interface. Accesses psychological warfare protocols and behavioral analysis systems."
        classification="OMEGA"
        accessLevel="OPERATOR"
        position="bottom-right"
        isVisible={showInfo}
        glyphPosition={glyphPosition}
      />
    )}
    </>
  );
};

export default QuantumFluxGlyph;