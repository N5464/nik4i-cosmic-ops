import React from 'react';
import { X } from 'lucide-react';
import ZipStash from '../components/ZipStash';
import MiniBunker from '../components/MiniBunker';
import BunkerGlyph from '../components/BunkerGlyph';
import DualBladeIntel from '../components/DualBladeIntel';
import SavedClipsVault from '../components/SavedClipsVault';

interface PayloadDeckProps {
  isVisible: boolean;
  onClose: () => void;
}

const PayloadDeck: React.FC<PayloadDeckProps> = ({ isVisible, onClose }) => {
  const [showMiniBunker, setShowMiniBunker] = React.useState(false);
  const [bunkerGlitchActive, setBunkerGlitchActive] = React.useState(false);
  const [vaultRef, setVaultRef] = React.useState<any>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Reset scroll position when overlay becomes visible
  React.useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      // Use requestAnimationFrame + setTimeout for robust scroll reset
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }, 50);
      });
    }
  }, [isVisible]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleBunkerGlyphClick = () => {
    setShowMiniBunker(true);
    setBunkerGlitchActive(true);
    setTimeout(() => setBunkerGlitchActive(false), 300);
  };

  const handleSaveClip = async (source: string, content: string, intel: string) => {
    // Use the global function exposed by SavedClipsVault
    if ((window as any).addClipToVault) {
      await (window as any).addClipToVault(source, content, intel);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9998] transition-all duration-500"
      style={{
        background: '#4B5563',
      }}
      onClick={handleBackdropClick}
    >
      <div 
        className="fixed inset-0 z-[9998] transition-all duration-500 flex flex-col"
        style={{
          background: '#4B5563',
        }}
        onClick={handleBackdropClick}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 flex-shrink-0 relative z-10">
        {/* Exit Button - Top Left */}
        <button 
          onClick={onClose}
          className="group relative p-3 border border-slate-400/30 bg-slate-800/60 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-sm button-press hover-lift"
          style={{ 
            boxShadow: '0 0 15px rgba(148, 163, 184, 0.2)',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)'
          }}
        >
          <div className="flex items-center space-x-2">
            <X className="w-4 h-4 text-slate-300 group-hover:text-slate-200" />
            <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 font-mono text-sm hidden sm:inline">
              EXIT
            </span>
          </div>
          <div className="absolute inset-0 border border-slate-300/0 group-hover:border-slate-300/20 transition-all duration-300"
               style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)' }}></div>
        </button>

        {/* Title - Top Right */}
        <div className="relative">
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider transition-all duration-300"
            style={{
              fontFamily: '"Orbitron", "Exo 2", "Rajdhani", monospace',
              background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 30%, #94A3B8 60%, #64748B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(226, 232, 240, 0.3)',
              filter: 'drop-shadow(0 0 10px rgba(226, 232, 240, 0.4))',
            }}
          >
            PAYLOAD DECK
          </h1>
          
          {/* Subtle Glow Effect */}
          <div 
            className="absolute inset-0 opacity-30 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(226, 232, 240, 0.1) 50%, transparent 100%)',
              filter: 'blur(2px)',
            }}
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-6 sm:p-8">
          <div className="space-y-6">
            {/* ZipStash Module */}
            <ZipStash />
            
            {/* Dual Blade Intel Module */}
            <DualBladeIntel onSaveClip={handleSaveClip} />
            
            {/* Saved Clips Vault Module */}
            <SavedClipsVault onAddClip={handleSaveClip} />

          </div>
        </div>
      </div>

      {/* Bunker Glyph - Sticky Widget */}
      <BunkerGlyph
        onClick={handleBunkerGlyphClick}
        glitchActive={bunkerGlitchActive}
      />

      {/* Subtle Corner Accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-slate-400/20 animate-pulse"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-slate-400/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-slate-400/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-slate-400/20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Mini Bunker Modal */}
      <MiniBunker
        isVisible={showMiniBunker}
        onClose={() => setShowMiniBunker(false)}
      />
      </div>
    </div>
  );
};

export default PayloadDeck;