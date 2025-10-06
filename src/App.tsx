import React, { useState, useEffect, useRef } from 'react';
import FocusedContentBlock from './components/FocusedContentBlock';
import GhostTrigger from './components/GhostTrigger';
import GlyphInfoBox from './components/GlyphInfoBox';
import GhostLayer from './components/GhostLayer';
import DataVaultGlyph from './components/DataVaultGlyph';
import MissionFilesOverlay from './components/MissionFilesOverlay';
import LoadingTunnel from './components/LoadingTunnel';
import PayloadDeck from './pages/PayloadDeck';
import QuantumFluxGlyph from './components/QuantumFluxGlyph';
import QuantumOverlay from './components/QuantumOverlay';
import PayloadGlyph from './components/PayloadGlyph';
import DefiIntelligenceBar from './components/DefiIntelligenceBar';
import { contentData, ContentItem } from './data/contentData';

function App() {
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);
  const [showGhostLayer, setShowGhostLayer] = useState(false);
  const [ghostGlitchActive, setGhostGlitchActive] = useState(false);
  const [missionFolderOpen, setMissionFolderOpen] = useState(false);
  const [missionFolderGlitch, setMissionFolderGlitch] = useState(false);
  const [squareGlitchActive, setSquareGlitchActive] = useState(false);
  const [showLoadingTunnel, setShowLoadingTunnel] = useState(false);
  const [showPayloadDeck, setShowPayloadDeck] = useState(false);
  const [quantumFluxGlitchActive, setQuantumFluxGlitchActive] = useState(false);
  const [showQuantumOverlay, setShowQuantumOverlay] = useState(false);
  const [defiIntelBarGlitchActive, setDefiIntelBarGlitchActive] = useState(false);

  // Silent trigger function for webhook
  const sendSilentTrigger = async (zone: string, glyph: string) => {
    try {
      await fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: zone,
          glyph: glyph,
        }),
      });
      // Silent trigger - no user feedback needed
    } catch (error) {
      // Silent trigger - suppress errors to avoid disrupting user experience
      console.error('Silent trigger failed:', error);
    }
  };

  const handleCloseFocusedBlock = () => {
    setSelectedContentItem(null);
  };

  const handleGhostTriggerClick = () => {
    // Send silent trigger
    sendSilentTrigger('breached', 'ghost_trigger');
    
    setShowGhostLayer(true);
    setGhostGlitchActive(true);
    setTimeout(() => setGhostGlitchActive(false), 300);
  };

  const handleGhostLayerClose = () => {
    setShowGhostLayer(false);
  };

  const handleMissionFolderClick = () => {
    // Send silent trigger
    sendSilentTrigger('breached', 'data_vault_glyph');
    
    setSelectedContentItem(contentData[0]);
    setMissionFolderOpen(false);
    setMissionFolderGlitch(true);
    setTimeout(() => setMissionFolderGlitch(false), 300);
  };

  const handleSquareGlyphClick = () => {
    // Send silent trigger
    sendSilentTrigger('breached', 'payload_glyph');
    
    setSquareGlitchActive(true);
    setTimeout(() => setSquareGlitchActive(false), 300);
    setShowLoadingTunnel(true);
  };

  const handleLoadingTunnelComplete = () => {
    setShowLoadingTunnel(false);
    setShowPayloadDeck(true);
  };

  const handlePayloadDeckClose = () => {
    setShowPayloadDeck(false);
  };


  const handleQuantumFluxClick = () => {
    // Send silent trigger
    sendSilentTrigger('breached', 'quantum_flux');
    
    setQuantumFluxGlitchActive(true);
    setTimeout(() => setQuantumFluxGlitchActive(false), 300);
    setShowQuantumOverlay(true);
  };

  const handleQuantumOverlayClose = () => {
    setShowQuantumOverlay(false);
  };

  const handleDefiIntelBarClick = () => {
    // Send silent trigger
    sendSilentTrigger('breached', 'defi_intelligence');

    setDefiIntelBarGlitchActive(true);
    setTimeout(() => setDefiIntelBarGlitchActive(false), 300);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedContentItem) {
          setSelectedContentItem(null);
        } else if (showGhostLayer) {
          setShowGhostLayer(false);
        } else if (missionFolderOpen) {
          setMissionFolderOpen(false);
        } else if (showPayloadDeck) {
          setShowPayloadDeck(false);
        } else if (showQuantumOverlay) {
          setShowQuantumOverlay(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedContentItem, showGhostLayer, missionFolderOpen, showPayloadDeck, showQuantumOverlay]);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Central Title and Subtitle */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <h1 
          className="font-aldrich text-2xl sm:text-3xl lg:text-4xl mb-2"
          style={{
            color: '#333333',
          }}
        >
          GHOST SYSTEMS
        </h1>
        <p 
          className="font-exo2 text-sm sm:text-base"
          style={{
            color: '#444444',
          }}
        >
          NEURAL NETWORK ACTIVE
        </p>
        <p 
          className="font-mono text-xs sm:text-sm text-slate-400 tracking-wide mt-2"
          style={{
            color: '#666666',
          }}
        >
          TACTICAL DEPLOYMENTS. OPERATIONAL PORTFOLIO.
        </p>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <GhostTrigger 
        onClick={handleGhostTriggerClick}
        glitchActive={ghostGlitchActive}
      />

      <DataVaultGlyph
        onClick={handleMissionFolderClick}
        glitchActive={missionFolderGlitch}
      />


      <PayloadGlyph
        onClick={handleSquareGlyphClick}
        glitchActive={squareGlitchActive}
      />

      <QuantumFluxGlyph
        onClick={handleQuantumFluxClick}
        glitchActive={quantumFluxGlitchActive}
      />

      <DefiIntelligenceBar
        onClick={handleDefiIntelBarClick}
        glitchActive={defiIntelBarGlitchActive}
      />

      {selectedContentItem && (
        <FocusedContentBlock
          item={selectedContentItem}
          onClose={handleCloseFocusedBlock}
        />
      )}

      <GhostLayer
        isVisible={showGhostLayer}
        onClose={handleGhostLayerClose}
      />

      <MissionFilesOverlay
        isVisible={missionFolderOpen}
        onClose={() => setMissionFolderOpen(false)}
      />

      <LoadingTunnel
        isVisible={showLoadingTunnel}
        onComplete={handleLoadingTunnelComplete}
      />

      <PayloadDeck
        isVisible={showPayloadDeck}
        onClose={handlePayloadDeckClose}
      />

      <QuantumOverlay
        isVisible={showQuantumOverlay}
        onClose={handleQuantumOverlayClose}
      />

    </div>
  );
}

export default App;