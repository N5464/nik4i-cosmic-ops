import React from 'react';
import { ChevronRight, Droplets } from 'lucide-react';

interface DefiIntelligenceBarProps {
  onClick: () => void;
  glitchActive: boolean;
}

const DefiIntelligenceBar: React.FC<DefiIntelligenceBarProps> = ({ onClick, glitchActive }) => {
  return (
    <div
      className="fixed right-0 top-1/2 transform -translate-y-1/2 group z-50 cursor-pointer"
      onClick={onClick}
    >
        <div
          className={`relative transition-all duration-700 hover:scale-105 hover:-translate-x-2 ${
            glitchActive ? 'animate-pulse scale-105 -translate-x-2' : ''
          }`}
        >
          {/* Main Gateway Bar - Liquid glass shape with cut corners */}
          <div
            className="w-6 h-40 border-2 border-slate-400/50 hover:border-slate-300/70 transition-all duration-700 backdrop-blur-md relative overflow-hidden"
            style={{
              clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)',
              background: glitchActive
                ? 'linear-gradient(180deg, rgba(71, 85, 105, 0.25), rgba(51, 65, 85, 0.15), rgba(71, 85, 105, 0.25))'
                : 'linear-gradient(180deg, rgba(71, 85, 105, 0.15), rgba(51, 65, 85, 0.08), rgba(71, 85, 105, 0.15))',
              filter: glitchActive
                ? 'drop-shadow(0 0 20px rgba(148, 163, 184, 0.8))'
                : 'drop-shadow(0 0 15px rgba(148, 163, 184, 0.6))',
              boxShadow: glitchActive
                ? 'inset 0 0 20px rgba(148, 163, 184, 0.3), 0 0 30px rgba(148, 163, 184, 0.4)'
                : 'inset 0 0 15px rgba(148, 163, 184, 0.2), 0 0 20px rgba(148, 163, 184, 0.3)',
            }}
          >
            {/* Inner Glass Layer */}
            <div
              className="absolute inset-1 border border-slate-300/40 hover:border-slate-200/60 transition-all duration-700 backdrop-blur-sm"
              style={{
                clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 82%)',
                background: glitchActive
                  ? 'linear-gradient(180deg, rgba(148, 163, 184, 0.12), rgba(100, 116, 139, 0.06), rgba(148, 163, 184, 0.12))'
                  : 'linear-gradient(180deg, rgba(148, 163, 184, 0.08), rgba(100, 116, 139, 0.04), rgba(148, 163, 184, 0.08))',
              }}
            />

            {/* Gateway Icons and Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
              {/* Top Icon */}
              <Droplets
                className="w-4 h-4 transition-all duration-700 group-hover:scale-110"
                style={{
                  color: glitchActive ? '#cbd5e1' : '#94a3b8',
                  filter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 1))',
                }}
              />

              {/* Vertical Text */}
              <div className="flex flex-col items-center space-y-1">
                <div
                  className="text-slate-300 font-mono text-xs font-bold tracking-wider transform rotate-90 origin-center whitespace-nowrap"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.8))',
                  }}
                >
                  DEFI INTEL
                </div>
              </div>

              {/* Bottom Arrow */}
              <ChevronRight
                className="w-3 h-3 transition-all duration-700 group-hover:scale-110 group-hover:-translate-x-1"
                style={{
                  color: glitchActive ? '#cbd5e1' : '#94a3b8',
                  filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 1))',
                }}
              />
            </div>

            {/* Hover/Glitch Glow Effect */}
            <div className={`absolute inset-0 transition-all duration-700 ${
              glitchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div
                className={`w-6 h-40 border animate-pulse ${
                  glitchActive ? 'border-slate-200/80' : 'border-slate-300/70'
                }`}
                style={{
                  clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)',
                  filter: 'drop-shadow(0 0 25px rgba(148, 163, 184, 0.8))',
                  boxShadow: '0 0 15px 2px rgba(148, 163, 184, 0.6)'
                }}
              />
            </div>

            {/* Liquid Flow Lines */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div
                className="absolute top-6 left-2 right-1 h-px bg-gradient-to-r from-transparent via-slate-300/30 to-transparent animate-pulse"
                style={{ animationDuration: '3s' }}
              />
              <div
                className="absolute bottom-6 left-2 right-1 h-px bg-gradient-to-r from-transparent via-slate-300/20 to-transparent animate-pulse"
                style={{ animationDuration: '3s', animationDelay: '1.5s' }}
              />
              <div
                className="absolute top-1/2 left-2 right-1 h-px bg-gradient-to-r from-transparent via-slate-300/25 to-transparent animate-pulse"
                style={{ animationDuration: '4s', animationDelay: '0.8s' }}
              />
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
              <div
                className="w-full h-full bg-gradient-to-b from-slate-300/30 via-transparent to-slate-400/20 animate-pulse"
                style={{
                  clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)',
                  animationDuration: '4s'
                }}
              />
            </div>
          </div>
        </div>
    </div>
  );
};

export default DefiIntelligenceBar;
