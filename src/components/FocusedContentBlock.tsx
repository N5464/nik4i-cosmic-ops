import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, FileText, Shield, Database } from 'lucide-react';
import { ContentItem, contentData } from '../data/contentData';

interface FocusedContentBlockProps {
  item: ContentItem;
  onClose: () => void;
}

const FocusedContentBlock: React.FC<FocusedContentBlockProps> = ({ item, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(() => 
    contentData.findIndex(file => file.id === item.id)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentFile = contentData[currentFileIndex] || item;

  // Reset scroll position when content item changes
  useEffect(() => {
    if (contentRef.current) {
      // Use requestAnimationFrame + setTimeout for robust scroll reset
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = 0;
          }
        }, 50);
      });
    }
  }, [currentFile.id]);

  // Helper function to extract clean file names
  const getCleanFileName = (fileName: string) => {
    // Remove "FILE XXX – " prefix and return clean name
    const match = fileName.match(/^FILE \d{3} – (.+)$/);
    return match ? match[1] : fileName;
  };

  // Enhanced theme colors with module-specific styling
  const getThemeColors = () => {
    if (currentFile.id === 'mystical_dao_005') {
      return {
        primary: '#8B5CF6',
        secondary: '#7C3AED',
        accent: '#A78BFA',
        bg: 'bg-violet-950/20',
        border: 'border-violet-400/40',
        text: 'text-violet-100',
        textSecondary: 'text-violet-300',
        textMuted: 'text-violet-400/70',
        glow: 'shadow-violet-400/20',
        pulse: 'border-pulse-violet',
        moduleGlow: '0 0 30px rgba(139, 92, 246, 0.3)',
        dataFlow: 'rgba(139, 92, 246, 0.2)'
      };
    }
    if (currentFile.id === 'fireprint_degenshop_003') {
      return {
        primary: '#F59E0B',
        secondary: '#D97706',
        accent: '#FCD34D',
        bg: 'bg-amber-950/20',
        border: 'border-amber-400/40',
        text: 'text-amber-100',
        textSecondary: 'text-amber-300',
        textMuted: 'text-amber-400/70',
        glow: 'shadow-amber-400/20',
        pulse: 'border-pulse-yellow',
        moduleGlow: '0 0 30px rgba(245, 158, 11, 0.3)',
        dataFlow: 'rgba(245, 158, 11, 0.2)'
      };
    }
    if (currentFile.id === 'zoomturret_sniper_002') {
      return {
        primary: '#14B8A6',
        secondary: '#0D9488',
        accent: '#5EEAD4',
        bg: 'bg-teal-950/20',
        border: 'border-teal-400/40',
        text: 'text-teal-100',
        textSecondary: 'text-teal-300',
        textMuted: 'text-teal-400/70',
        glow: 'shadow-teal-400/20',
        pulse: 'border-pulse-teal',
        moduleGlow: '0 0 30px rgba(20, 184, 166, 0.3)',
        dataFlow: 'rgba(20, 184, 166, 0.2)'
      };
    }
    if (currentFile.id === 'worm_neural_004') {
      return {
        primary: '#06B6D4',
        secondary: '#0891B2',
        accent: '#67E8F9',
        bg: 'bg-cyan-950/20',
        border: 'border-cyan-400/40',
        text: 'text-cyan-100',
        textSecondary: 'text-cyan-300',
        textMuted: 'text-cyan-400/70',
        glow: 'shadow-cyan-400/20',
        pulse: 'border-pulse-cyan',
        moduleGlow: '0 0 30px rgba(6, 182, 212, 0.3)',
        dataFlow: 'rgba(6, 182, 212, 0.2)'
      };
    }
    // Default theme (File 001)
    return {
      primary: '#64748B',
      secondary: '#475569',
      accent: '#94A3B8',
      bg: 'bg-slate-800/20',
      border: 'border-slate-400/40',
      text: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400/70',
      glow: 'shadow-slate-400/20',
      pulse: 'border-pulse-default',
      moduleGlow: '0 0 30px rgba(148, 163, 184, 0.3)',
      dataFlow: 'rgba(148, 163, 184, 0.2)'
    };
  };

  const theme = getThemeColors();

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleNextFile = () => {
    if (currentFileIndex < contentData.length - 1) {
      setIsTransitioning(true);
      setCurrentFileIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handlePrevFile = () => {
    if (currentFileIndex > 0) {
      setIsTransitioning(true);
      setCurrentFileIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-all duration-500 z-50 flex flex-col p-4 sm:p-8" 
      ref={contentRef}
      onClick={handleBackdropClick}
    >
      {/* Main Dossier Container */}
      <div 
        className="flex-1 overflow-y-auto"
      >
        {/* Dossier Grid Layout */}
        <div className={`h-full grid grid-cols-12 gap-4 transition-all duration-500 ${
          isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          
          {/* Header Control Module */}
          <div 
            className={`col-span-12 row-span-2 ${theme.bg} border-2 ${theme.border} ${theme.pulse} backdrop-blur-sm relative overflow-hidden circuit-pattern data-flow-border`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
              boxShadow: theme.moduleGlow
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 h-full flex items-center justify-between p-4 sm:p-6">
              {/* File Header */}
              <div className="flex items-center space-x-4">
                <Shield className={`w-6 h-6 ${theme.textSecondary}`} />
                <div className="flex-grow min-w-0">
                  <h2 className={`${theme.text} font-mono text-sm sm:text-lg font-bold holographic-text leading-tight`}>
                    {currentFile.id === 'fireprint_degenshop_003' ? (
                      <a 
                        href="https://fireprint.tools" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-orange-300 transition-colors duration-300 animate-pulse hover:animate-none"
                      >
                        {getCleanFileName(currentFile.name)}
                      </a>
                    ) : (
                      getCleanFileName(currentFile.name)
                    )}
                  </h2>
                  <div className={`${theme.textMuted} font-mono text-xs mt-1`}>
                    CLASSIFIED DOSSIER
                  </div>
                </div>
              </div>

              {/* Navigation Control Panel */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevFile}
                    disabled={currentFileIndex === 0}
                    className={`p-2 border ${theme.border} ${theme.bg} hover:bg-white/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed`}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
                  >
                    <ChevronLeft className={`w-4 h-4 ${theme.textSecondary}`} />
                  </button>
                  
                  <div className={`px-3 py-1 ${theme.bg} border ${theme.border} ${theme.textSecondary} font-mono text-sm`}>
                    {String(currentFileIndex + 1).padStart(3, '0')} / {String(contentData.length).padStart(3, '0')}
                  </div>
                  
                  <button
                    onClick={handleNextFile}
                    disabled={currentFileIndex === contentData.length - 1}
                    className={`p-2 border ${theme.border} ${theme.bg} hover:bg-white/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed`}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
                  >
                    <ChevronRight className={`w-4 h-4 ${theme.textSecondary}`} />
                  </button>
                </div>

                <button 
                  onClick={onClose}
                  className={`p-2 border border-red-500/40 bg-red-950/20 hover:bg-red-950/40 transition-all duration-300`}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Corner Accents */}
            <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${theme.border} animate-pulse`}></div>
            <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${theme.border} animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
          </div>


          {/* File Info Module */}
          <div 
            className={`col-span-12 lg:col-span-6 row-span-5 ${theme.bg} border-2 ${theme.border} backdrop-blur-sm relative overflow-hidden circuit-pattern data-flow-border module-float`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              boxShadow: theme.moduleGlow,
              animationDelay: '1s'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            
            {/* Module Header */}
            <div className={`border-b ${theme.border} p-3 bg-black/20`}>
              <div className="flex items-center space-x-2">
                <Database className={`w-4 h-4 ${theme.textSecondary}`} />
                <span className={`${theme.textSecondary} font-mono text-sm font-bold`}>FILE METADATA</span>
              </div>
            </div>

            {/* Metadata Content */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${theme.textMuted} font-mono text-xs`}>FILE ID:</span>
                  <span className={`${theme.text} font-mono text-xs font-bold`}>{currentFile.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme.textMuted} font-mono text-xs`}>STATUS:</span>
                  <span className={`${currentFile.id === 'mystical_dao_005' ? 'text-yellow-400' : 'text-green-400'} font-mono text-xs font-bold animate-pulse`}>
                    {currentFile.id === 'mystical_dao_005' ? 'IN DEVELOPMENT' : 'ACTIVE'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme.textMuted} font-mono text-xs`}>ACCESS LEVEL:</span>
                  <span className={`${theme.textSecondary} font-mono text-xs font-bold`}>OPERATOR</span>
                </div>
                
                {/* StrikeHub V2 Link */}
                {currentFile.id === 'strikehub_001' && (
                  <div className="flex justify-between items-center">
                    <span className={`${theme.textMuted} font-mono text-xs`}>VERSION:</span>
                    <a 
                      href="https://demigod.systems/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-mono text-xs font-bold hover:underline transition-all duration-300 cursor-pointer"
                    >
                      strikehubv2
                    </a>
                  </div>
                )}
              </div>

              {/* Special FirePrint Link */}
              {currentFile.id === 'fireprint_degenshop_003' && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <a 
                    href="https://fireprint.tools" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full p-2 bg-gradient-to-r from-orange-900/20 to-amber-900/20 border border-orange-400/40 hover:border-orange-400/60 transition-all duration-300 text-center"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
                  >
                    <span className="text-orange-400 font-mono text-xs font-bold">→ ACCESS FIREPRINT.TOOLS</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Briefing Module */}
          <div 
            className={`col-span-12 lg:col-span-6 row-span-5 flex flex-col ${theme.bg} border-2 ${theme.border} backdrop-blur-sm relative overflow-hidden circuit-pattern data-flow-border module-float`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              boxShadow: theme.moduleGlow,
              animationDelay: '1.5s'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            
            {/* Module Header */}
            <div className={`border-b ${theme.border} p-3 bg-black/20`}>
              <div className="flex items-center space-x-2">
                <FileText className={`w-4 h-4 ${theme.textSecondary}`} />
                <span className={`${theme.textSecondary} font-mono text-sm font-bold`}>MISSION BRIEFING</span>
              </div>
            </div>

            {/* Briefing Content */}
            <div className="flex-1 overflow-y-auto p-4" ref={contentRef}>
              <div className={`${theme.text} font-mono text-xs leading-relaxed whitespace-pre-line`} 
                   style={{ 
                     letterSpacing: '0.025em',
                     lineHeight: '1.6',
                     textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
                   }}>
                {currentFile.description}
              </div>
            </div>
          </div>

          {/* Status Bar Module */}
          <div 
            className={`col-span-12 row-span-1 ${theme.bg} border-2 ${theme.border} backdrop-blur-sm relative overflow-hidden circuit-pattern data-flow-border`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              boxShadow: theme.moduleGlow
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 h-full flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 bg-green-400 rounded-full animate-pulse`}></div>
                  <span className={`${theme.textMuted} font-mono text-xs`}>SYSTEM OPERATIONAL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${theme.bg} border ${theme.border} rounded-full animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
                  <span className={`${theme.textMuted} font-mono text-xs`}>SECURE CONNECTION</span>
                </div>
              </div>
              
              <div className={`${theme.textMuted} font-mono text-xs`}>
                WARROOM INTERFACE v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusedContentBlock;