import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, Mail, Send, Gamepad2, RotateCcw, Save, Loader2 } from 'lucide-react';
import BlackWire from './BlackWire';
import BlackBoxLogs from './BlackBoxLogs';
import { supabase } from '../lib/supabaseClient';

interface GhostLayerProps {
  isVisible: boolean;
  onClose: () => void;
}

const GhostLayer: React.FC<GhostLayerProps> = ({ isVisible, onClose }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [missionInput, setMissionInput] = useState('');
  const [briefResult, setBriefResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResultsBox, setShowResultsBox] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [isSavingBrief, setIsSavingBrief] = useState(false);
  const [briefSavedSuccess, setBriefSavedSuccess] = useState(false);
  
  // SignalBlast state
  const [activeChannelForm, setActiveChannelForm] = useState<'email' | 'telegram' | 'discord' | null>(null);
  
  // Email form state
  const [emailTarget, setEmailTarget] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  
  // Telegram form state
  const [telegramTarget, setTelegramTarget] = useState('');
  const [telegramMessage, setTelegramMessage] = useState('');
  
  // Discord form state
  const [discordTarget, setDiscordTarget] = useState('');
  const [discordMessage, setDiscordMessage] = useState('');
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatusMessage, setDeployStatusMessage] = useState('');
  const [deployStatusType, setDeployStatusType] = useState<'success' | 'error' | ''>('');
  
  // Deploy lock states
  const [showPasswordInput, setShowPasswordInput] = useState<{[key: string]: boolean}>({
    email: false,
    telegram: false,
    discord: false
  });
  const [deployPassword, setDeployPassword] = useState('');
  const [unlockedChannels, setUnlockedChannels] = useState<{[key: string]: boolean}>({
    email: false,
    telegram: false,
    discord: false
  });
  const [passwordVerifying, setPasswordVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // BlackBox refresh trigger
  const [blackBoxRefreshTrigger, setBlackBoxRefreshTrigger] = useState(0);
  
  // Reset scroll position when overlay becomes visible
  useEffect(() => {
    if (isVisible && showContent && scrollContainerRef.current) {
      // Use requestAnimationFrame + setTimeout for robust scroll reset
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }, 300);
      });
    }
  }, [isVisible, showContent]);

  // Check if Claude Ghost Brief is active
  const isBriefActive = missionInput.trim() !== '' || briefResult !== '';

  useEffect(() => {
    if (isVisible) {
      // Delay content appearance for tunnel effect
      const timer = setTimeout(() => setShowContent(true), 800);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  const handleExecuteBrief = async () => {
    if (!missionInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: 'claude-brief',
          mission: missionInput.trim()
        }),
      });

      const responseText = await response.text();
      setBriefResult(responseText);
      setShowResultsBox(true);
    } catch (error) {
      console.error('Error executing brief:', error);
      setBriefResult('ERROR: Failed to execute brief. Connection lost.');
      setShowResultsBox(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetBrief = () => {
    setMissionInput('');
    setBriefResult('');
    setIsLoading(false);
    setShowResultsBox(false);
    setCopySuccess('');
  };

  const handleSaveBrief = async () => {
    if (!briefResult.trim()) return;

    setIsSavingBrief(true);
    try {
      // Generate unique session ID for Claude brief
      const sessionId = `cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('blackwire_messages')
        .insert([
          {
            session_id: sessionId,
            sender: 'agent',
            message_content: briefResult,
            user_id: 'demigod_owner',
            is_saved: true
          }
        ]);

      if (error) {
        console.error('Error saving Claude brief:', error);
      } else {
        setBriefSavedSuccess(true);
        setTimeout(() => setBriefSavedSuccess(false), 2000);
        // Trigger BlackBox refresh when Claude brief is saved
        handleBlackWireMessageSaved();
      }
    } catch (error) {
      console.error('Error in handleSaveBrief:', error);
    } finally {
      setIsSavingBrief(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(briefResult);
      setCopySuccess('COPIED');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopySuccess('COPY FAILED');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handlePasswordSubmit = async (channel: 'email' | 'telegram' | 'discord') => {
    if (!deployPassword.trim()) {
      setPasswordError('Password required');
      setTimeout(() => setPasswordError(''), 2000);
      return;
    }

    setPasswordVerifying(true);
    setPasswordError('');

    try {
      const response = await fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: 'silent',
          mode: 'deploy',
          pass: deployPassword.trim()
        }),
      });

      const responseText = await response.text();

      if (responseText.trim() === 'Accepted') {
        // Unlock the channel
        setUnlockedChannels(prev => ({ ...prev, [channel]: true }));
        setShowPasswordInput(prev => ({ ...prev, [channel]: false }));
        setDeployPassword('');
        setPasswordError('');
      } else if (responseText.trim() === 'Rejected') {
        setPasswordError('ACCESS DENIED');
        setDeployPassword('');
        setTimeout(() => setPasswordError(''), 2000);
      } else {
        setPasswordError('Connection error');
        setDeployPassword('');
        setTimeout(() => setPasswordError(''), 2000);
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Connection error');
      setDeployPassword('');
      setTimeout(() => setPasswordError(''), 2000);
    } finally {
      setPasswordVerifying(false);
    }
  };

  const handleDeploy = async (channel: 'email' | 'telegram' | 'discord') => {
    // Phase 1: If channel is not unlocked, show password input
    if (!unlockedChannels[channel]) {
      setShowPasswordInput(prev => ({ ...prev, [channel]: true }));
      return;
    }

    // Phase 2: Channel is unlocked, proceed with deployment
    // Channel-specific validation
    let isValid = true;
    let errorMessage = '';
    
    if (channel === 'email') {
      if (!emailTarget.trim() || !emailSubject.trim() || !emailMessage.trim()) {
        isValid = false;
        errorMessage = 'ERROR: All email fields are required';
      }
    } else if (channel === 'telegram') {
      if (!telegramTarget.trim() || !telegramMessage.trim()) {
        isValid = false;
        errorMessage = 'ERROR: Target and message are required for Telegram';
      }
    } else if (channel === 'discord') {
      if (!discordTarget.trim() || !discordMessage.trim()) {
        isValid = false;
        errorMessage = 'ERROR: Target and message are required for Discord';
      }
    }
    
    if (!isValid) {
      setDeployStatusMessage(errorMessage);
      setDeployStatusType('error');
      setTimeout(() => {
        setDeployStatusMessage('');
        setDeployStatusType('');
      }, 3000);
      return;
    }

    setIsDeploying(true);
    
    // Construct payload based on channel
    let payload;
    if (channel === 'email') {
      payload = {
        zone: 'signalblast',
        channel: 'email',
        target: emailTarget.trim(),
        subject: emailSubject.trim(),
        message: emailMessage.trim()
      };
    } else if (channel === 'telegram') {
      payload = {
        zone: 'signalblast',
        channel: 'telegram',
        target: telegramTarget.trim(),
        message: telegramMessage.trim()
      };
    } else if (channel === 'discord') {
      payload = {
        zone: 'signalblast',
        channel: 'discord',
        target: discordTarget.trim(),
        message: discordMessage.trim()
      };
    }
    
    try {
      const response = await fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      
      if (response.ok) {
        setDeployStatusMessage(`${channel.toUpperCase()} SIGNAL DEPLOYED SUCCESSFULLY`);
        setDeployStatusType('success');
        
        // Reset channel unlock status after successful deployment
        setUnlockedChannels(prev => ({ ...prev, [channel]: false }));
        
        // Reset specific channel form and return to toggle view
        if (channel === 'email') {
          setEmailTarget('');
          setEmailSubject('');
          setEmailMessage('');
        } else if (channel === 'telegram') {
          setTelegramTarget('');
          setTelegramMessage('');
        } else if (channel === 'discord') {
          setDiscordTarget('');
          setDiscordMessage('');
        }
        
        setActiveChannelForm(null);
      } else {
        setDeployStatusMessage('DEPLOYMENT FAILED: ' + responseText);
        setDeployStatusType('error');
      }
    } catch (error) {
      console.error('Error deploying signal:', error);
      setDeployStatusMessage('ERROR: Connection failed. Signal not deployed.');
      setDeployStatusType('error');
    } finally {
      setIsDeploying(false);
      // Clear status message after 5 seconds
      setTimeout(() => {
        setDeployStatusMessage('');
        setDeployStatusType('');
      }, 5000);
    }
  };

  const handleBlackWireMessageSaved = () => {
    // Trigger BlackBox refresh when a message is saved
    setBlackBoxRefreshTrigger(prev => prev + 1);
  };

  const handleNewSession = () => {
    const newSessionId = `bw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setMessages([]);
    setInputMessage('');
    inputRef.current?.focus();
    
    // Reset deploy lock states on new session
    setUnlockedChannels({ email: false, telegram: false, discord: false });
    setShowPasswordInput({ email: false, telegram: false, discord: false });
    setDeployPassword('');
    setPasswordError('');
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 transition-all duration-1000 ease-in-out ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      {/* Tunnel Animation Layer */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          isVisible ? 'scale-100' : 'scale-150'
        }`}
        style={{
          background: `
            radial-gradient(circle at center, 
              rgba(0, 0, 0, 0.95) 0%, 
              rgba(0, 0, 0, 0.98) 40%, 
              rgba(0, 0, 0, 1) 70%,
              rgba(0, 0, 0, 1) 100%
            ),
            linear-gradient(45deg, 
              rgba(6, 182, 212, 0.03) 0%, 
              rgba(239, 68, 68, 0.02) 50%, 
              rgba(6, 182, 212, 0.03) 100%
            )
          `,
        }}
      >
        {/* Animated Tunnel Rings */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute border border-cyan-400/20 rounded-full transition-all duration-2000 ${
                isVisible ? 'animate-ping' : ''
              }`}
              style={{
                left: '50%',
                top: '50%',
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                marginLeft: `-${(i + 1) * 100}px`,
                marginTop: `-${(i + 1) * 100}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>

        {/* Glitch Lines */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent h-px animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: '0',
                right: '0',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Particle Drift */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Ghost Interface Content */}
      <div 
        className={`relative z-10 h-full flex flex-col transition-all duration-1000 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        ref={layerRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h1 className="text-cyan-300 font-mono text-lg sm:text-2xl font-bold tracking-wider animate-pulse">
              &gt; GHOST SYSTEMS ACTIVE
            </h1>
          </div>
          
          {/* Exit Button */}
          <button 
            onClick={onClose}
            className="group relative px-3 sm:px-6 py-2 sm:py-3 border border-red-500/40 bg-black/80 hover:bg-red-900/20 transition-all duration-300 font-mono text-xs sm:text-sm"
            style={{ 
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)'
            }}
          >
            <span className="text-red-400 group-hover:text-red-300 transition-colors duration-300 animate-pulse">
              [EXIT GHOST LAYER]
            </span>
            <div className="absolute inset-0 border border-red-400/0 group-hover:border-red-400/40 transition-all duration-300"
                 style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)' }}></div>
            
            {/* Flickering Effect */}
            <div className="absolute inset-0 bg-red-400/5 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"
                 style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)' }}></div>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative">
          {/* Terminal Flicker Background */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full animate-pulse"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                animationDuration: '4s',
              }}
            />
          </div>

          {/* Ghost Interface Border */}
          <div 
            ref={scrollContainerRef}
            className="border border-cyan-400/20 bg-black/40 backdrop-blur-sm relative overflow-y-auto scrollbar-hide p-4 sm:p-8"
            style={{
              boxShadow: 'inset 0 0 50px rgba(6, 182, 212, 0.1), 0 0 30px rgba(6, 182, 212, 0.1)',
              height: 'calc(100vh - 200px)',
            }}
          >
            {/* Scanning Lines */}
            <div className="absolute inset-0">
              <div 
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"
                style={{
                  top: '20%',
                  animationDuration: '3s',
                }}
              />
              <div 
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-red-400/20 to-transparent animate-pulse"
                style={{
                  top: '60%',
                  animationDuration: '4s',
                  animationDelay: '1s',
                }}
              />
            </div>

            {/* Content Placeholder */}
            <div>
              {/* Content area ready for new implementation */}
              {/* AI Recon: Claude Ghost Brief Block */}
              <div 
                className="bg-black/60 border border-cyan-400/30 backdrop-blur-sm relative overflow-hidden mb-6"
                style={{
                  boxShadow: 'inset 0 0 30px rgba(6, 182, 212, 0.1), 0 0 20px rgba(6, 182, 212, 0.1)',
                  clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                }}
              >
                {/* Block Header */}
                <div className="border-b border-cyan-400/20 p-4">
                  <h2 className="text-cyan-300 font-black-ops text-2xl font-bold tracking-wider">
                    🔮 NEXUS ORACLE
                  </h2>
                </div>

                {/* Reset Button - Only visible when block is active */}
                {isBriefActive && (
                  <button
                    onClick={handleResetBrief}
                    className="absolute top-4 right-4 group p-2 border border-cyan-500/40 bg-cyan-900/20 hover:bg-cyan-900/40 transition-all duration-300 button-press hover-lift"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
                    title="Reset Brief"
                  >
                    <RotateCcw className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                  </button>
                )}

                {/* Block Content */}
                <div className="p-4 space-y-4">
                  {/* Mission Input */}
                  <div>
                    <input
                      type="text"
                      value={missionInput}
                      onChange={(e) => setMissionInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleExecuteBrief()}
                      className="w-full bg-black/40 border border-cyan-400/40 px-4 py-3 text-cyan-300 font-mono mobile-input focus:border-cyan-300 focus:outline-none transition-colors duration-300 placeholder-cyan-400/50 input-focus-glow"
                      placeholder="Type your mission..."
                      disabled={isLoading}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      }}
                    />
                  </div>

                  {/* Execute Button */}
                  <button
                    onClick={handleExecuteBrief}
                    disabled={!missionInput.trim() || isLoading}
                    className="w-full group px-6 py-3 border border-cyan-500/40 bg-cyan-900/20 hover:bg-cyan-900/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm font-bold button-press hover-lift"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                    }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-cyan-400/40 border-t-cyan-300 rounded-full enhanced-spinner"></div>
                          <span className="text-cyan-400">EXECUTING...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-cyan-400 group-hover:text-cyan-300">⚡ EXECUTE BRIEF</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Results Box */}
                  {showResultsBox && (
                    <div 
                      className="bg-black/80 border border-cyan-400/20 relative overflow-hidden"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      }}
                    >
                      {/* Results Header */}
                      <div className="border-b border-cyan-400/20 p-3 flex items-center justify-between">
                        <span className="text-cyan-400 font-mono text-xs font-bold">BRIEF RESULTS</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleCopy}
                            className="group flex items-center space-x-1 px-2 py-1 border border-cyan-500/30 bg-cyan-900/20 hover:bg-cyan-900/40 transition-all duration-300"
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)',
                            }}
                          >
                            {copySuccess ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" />
                                <span className="text-green-400 font-mono text-xs">{copySuccess}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-cyan-400 group-hover:text-cyan-300" />
                                <span className="text-cyan-400 group-hover:text-cyan-300 font-mono text-xs">COPY</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleSaveBrief}
                            disabled={!briefResult.trim() || isSavingBrief}
                            className="group flex items-center space-x-1 px-2 py-1 border border-green-500/30 bg-green-900/20 hover:bg-green-900/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)',
                            }}
                          >
                            {isSavingBrief ? (
                              <>
                                <Loader2 className="w-3 h-3 text-green-400 enhanced-spinner" />
                                <span className="text-green-400 font-mono text-xs">SAVING...</span>
                              </>
                            ) : briefSavedSuccess ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" />
                                <span className="text-green-400 font-mono text-xs">SAVED!</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-3 h-3 text-green-400 group-hover:text-green-300" />
                                <span className="text-green-400 group-hover:text-green-300 font-mono text-xs">SAVE</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Results Content */}
                      <div className="p-4 max-h-64 overflow-y-auto terminal-scrollbar">
                        <pre className="text-cyan-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words content-fade-in-up">
                          {briefResult}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Block Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-400/40 animate-pulse"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-400/40 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-400/40 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-400/40 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
              </div>

              {/* SignalBlast: Multi-Channel Fire Block */}
              <div 
                className="bg-black/60 border border-red-400/30 backdrop-blur-sm relative overflow-hidden mb-6"
                style={{
                  boxShadow: 'inset 0 0 30px rgba(239, 68, 68, 0.1), 0 0 20px rgba(239, 68, 68, 0.1)',
                  clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                }}
              >
                {/* Block Header */}
                <div className="border-b border-red-400/20 p-4">
                  <h2 className="text-red-300 font-black-ops text-2xl font-bold tracking-wider">
                    🌌 VOID DISPATCH
                  </h2>
                </div>

                {/* Block Content */}
                <div className="p-4 space-y-4">
                  {/* Channel Selection or Form */}
                  {activeChannelForm === null ? (
                    /* Channel Toggle Buttons */
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      {/* Email Toggle */}
                      <div className="group relative">
                        <button
                          onClick={() => setActiveChannelForm('email')}
                          disabled={isDeploying}
                          className="relative w-full h-24 border-2 border-red-600/40 bg-black/60 hover:border-red-400/80 hover:bg-red-900/30 transition-all duration-500 disabled:opacity-50 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] button-press hover-lift"
                          style={{
                            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                          }}
                        >
                          {/* Inner glow layer */}
                          <div 
                            className="absolute inset-1 border border-red-500/30 group-hover:border-red-400/60 transition-all duration-500 bg-gradient-to-br from-red-900/10 to-transparent"
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                            }}
                          />
                          
                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                            <Mail className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            <span className="text-red-400 group-hover:text-red-300 font-mono text-xs font-bold tracking-wider transition-colors duration-300">
                              EMAIL
                            </span>
                          </div>
                          
                          {/* Animated border on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div 
                              className="w-full h-full border-2 border-red-400/60 animate-pulse"
                              style={{
                                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                                filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.6))'
                              }}
                            />
                          </div>
                        </button>
                      </div>

                      {/* Telegram Toggle */}
                      <div className="group relative">
                        <button
                          onClick={() => setActiveChannelForm('telegram')}
                          disabled={isDeploying}
                          className="relative w-full h-24 border-2 border-blue-600/40 bg-black/60 hover:border-blue-400/80 hover:bg-blue-900/30 transition-all duration-500 disabled:opacity-50 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] button-press hover-lift"
                          style={{
                            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                          }}
                        >
                          {/* Inner glow layer */}
                          <div 
                            className="absolute inset-1 border border-blue-500/30 group-hover:border-blue-400/60 transition-all duration-500 bg-gradient-to-br from-blue-900/10 to-transparent"
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                            }}
                          />
                          
                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                            <Send className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="text-blue-400 group-hover:text-blue-300 font-mono text-xs font-bold tracking-wider transition-colors duration-300">
                              TELEGRAM
                            </span>
                          </div>
                          
                          {/* Animated border on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div 
                              className="w-full h-full border-2 border-blue-400/60 animate-pulse"
                              style={{
                                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                                filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.6))'
                              }}
                            />
                          </div>
                        </button>
                      </div>

                      {/* Discord Toggle */}
                      <div className="group relative">
                        <button
                          onClick={() => setActiveChannelForm('discord')}
                          disabled={isDeploying}
                          className="relative w-full h-24 border-2 border-purple-600/40 bg-black/60 hover:border-purple-400/80 hover:bg-purple-900/30 transition-all duration-500 disabled:opacity-50 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] button-press hover-lift"
                          style={{
                            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                          }}
                        >
                          {/* Inner glow layer */}
                          <div 
                            className="absolute inset-1 border border-purple-500/30 group-hover:border-purple-400/60 transition-all duration-500 bg-gradient-to-br from-purple-900/10 to-transparent"
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                            }}
                          />
                          
                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                            <Gamepad2 className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]" />
                            <span className="text-purple-400 group-hover:text-purple-300 font-mono text-xs font-bold tracking-wider transition-colors duration-300">
                              DISCORD
                            </span>
                          </div>
                          
                          {/* Animated border on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div 
                              className="w-full h-full border-2 border-purple-400/60 animate-pulse"
                              style={{
                                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                                filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.6))'
                              }}
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Channel-Specific Forms */
                    <div className="space-y-4">
                      {/* Back Button */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => setActiveChannelForm(null)}
                          className="group px-3 py-2 border border-red-500/40 bg-red-900/20 hover:bg-red-900/40 transition-all duration-300 font-mono text-xs button-press"
                          style={{
                            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)',
                          }}
                        >
                          <span className="text-red-400 group-hover:text-red-300">← BACK</span>
                        </button>
                        <span className="text-red-300 font-mono text-sm font-bold">
                          {activeChannelForm.toUpperCase()} DEPLOYMENT
                        </span>
                      </div>

                      {/* Email Form */}
                      {activeChannelForm === 'email' && (
                        <div className="space-y-3">
                          <input
                            type="email"
                            value={emailTarget}
                            onChange={(e) => setEmailTarget(e.target.value)}
                            className="w-full bg-black/40 border border-red-400/40 px-4 py-3 text-red-300 font-mono mobile-input focus:border-red-300 focus:outline-none transition-colors duration-300 placeholder-red-400/50 input-focus-glow"
                            placeholder="target@email.com"
                            disabled={isDeploying}
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                            }}
                          />
                          <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full bg-black/40 border border-red-400/40 px-4 py-3 text-red-300 font-mono mobile-input focus:border-red-300 focus:outline-none transition-colors duration-300 placeholder-red-400/50 input-focus-glow"
                            placeholder="Subject Line Here"
                            disabled={isDeploying}
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                            }}
                          />
                          <textarea
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            className="w-full bg-black/40 border border-red-400/40 px-4 py-3 text-red-300 font-mono mobile-input focus:border-red-300 focus:outline-none transition-colors duration-300 placeholder-red-400/50 resize-none input-focus-glow"
                            placeholder="Your full email message body goes here..."
                            rows={4}
                            disabled={isDeploying}
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                            }}
                          />
                        </div>
                      )}

                      {/* Telegram Form */}
                      {activeChannelForm === 'telegram' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={telegramTarget}
                            onChange={(e) => setTelegramTarget(e.target.value)}
                            className="w-full bg-black/40 border border-red-400/40 px-4 py-3 text-red-300 font-mono mobile-input focus:border-red-300 focus:outline-none transition-colors duration-300 placeholder-red-400/50 input-focus-glow"
                            placeholder="@username_or_chat_id"
                            disabled={isDeploying}
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                            }}
                          />
                          <textarea
                            value={telegramMessage}
                            onChange={(e) => setTelegramMessage(e.target.value)}
                            className="w-full bg-black/40 border border-red-400/40 px-4 py-3 text-red-300 font-mono mobile-input focus:border-red-300 focus:outline-none transition-colors duration-300 placeholder-red-400/50 resize-none input-focus-glow"
                            placeholder="Your Telegram message goes here..."
                            rows={4}
                            disabled={isDeploying}
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                            }}
                          />
                        </div>
                      )}

                      {/* Discord Form */}
                      {activeChannelForm === 'discord' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={discordTarget}
                            onChange={(e) => setDiscordTarget(e.target.value)}
                            className="w-full bg-black/40 border border-red-400/40 px-4 py-3 text-red-300 font-mono mobile-input focus:border-red-300 focus:outline-none transition-colors duration-300 placeholder-red-400/50 input-focus-glow"
                            placeholder="Discord target (webhook URL, channel ID, etc.)"
                            disabled={isDeploying}
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                            }}
                          />
                          <textarea
                            value={discordMessage}
                            onChange={(e) => setDiscordMessage(e.target.value)}
                            className="w-full bg-black/40 border border-red-400/40 px-4 py-3 text-red-300 font-mono mobile-input focus:border-red-300 focus:outline-none transition-colors duration-300 placeholder-red-400/50 resize-none input-focus-glow"
                            placeholder="Your Discord message goes here..."
                            rows={4}
                            disabled={isDeploying}
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                            }}
                          />
                        </div>
                      )}

                      {/* Deploy Button */}
                      {showPasswordInput[activeChannelForm] ? (
                        /* Password Input Mode */
                        <div className="w-full flex space-x-2">
                          <input
                            type="password"
                            value={deployPassword}
                            onChange={(e) => setDeployPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !passwordVerifying && handlePasswordSubmit(activeChannelForm)}
                            className="flex-1 bg-black/60 border border-orange-400/40 px-3 py-3 text-orange-300 font-mono mobile-input focus:border-orange-300 focus:outline-none transition-colors duration-300 placeholder-orange-400/50 input-focus-glow"
                            placeholder="ACCESS CODE"
                            disabled={passwordVerifying}
                            autoFocus
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                            }}
                          />
                          <button
                            onClick={() => handlePasswordSubmit(activeChannelForm)}
                            disabled={!deployPassword.trim() || passwordVerifying}
                            className="group px-4 py-3 border border-orange-500/40 bg-orange-900/20 hover:bg-orange-900/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm font-bold button-press hover-lift"
                            style={{
                              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                            }}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              {passwordVerifying ? (
                                <div className="w-3 h-3 border border-orange-400/40 border-t-orange-300 rounded-full enhanced-spinner"></div>
                              ) : (
                                <span className="text-orange-400 group-hover:text-orange-300">→</span>
                              )}
                            </div>
                          </button>
                        </div>
                      ) : (
                        /* Deploy Button Mode */
                        <button
                          onClick={() => handleDeploy(activeChannelForm)}
                          disabled={isDeploying}
                          className={`w-full group px-6 py-3 border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm font-bold button-press hover-lift ${
                            unlockedChannels[activeChannelForm]
                              ? 'border-green-500/40 bg-green-900/20 hover:bg-green-900/40 hover:border-green-400/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                              : 'border-red-500/40 bg-red-900/20 hover:bg-red-900/40 hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                          }`}
                          style={{
                            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                          }}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {isDeploying ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-400/40 border-t-red-300 rounded-full enhanced-spinner"></div>
                                <span className="text-red-400">DEPLOYING...</span>
                              </>
                            ) : unlockedChannels[activeChannelForm] ? (
                              <>
                                <span className="text-green-400 group-hover:text-green-300">🚀 DEPLOY {activeChannelForm.toUpperCase()}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-400 group-hover:text-red-300">🔒 DEPLOY {activeChannelForm.toUpperCase()}</span>
                              </>
                            )}
                          </div>
                        </button>
                      )}

                      {/* Password Error Display */}
                      {passwordError && (
                        <div className="mt-2 p-2 bg-red-900/20 border border-red-500/40 rounded-sm">
                          <span className="text-red-400 font-mono text-xs">{passwordError}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Message */}
                  {deployStatusMessage && (
                    <div className={`p-3 border rounded-sm ${
                      deployStatusType === 'success' 
                        ? 'bg-green-900/20 border-green-500/40' 
                        : 'bg-red-900/20 border-red-500/40'
                    }`}>
                      <span className={`font-mono text-sm ${
                        deployStatusType === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}>{deployStatusMessage}</span>
                    </div>
                  )}
                </div>

                {/* Block Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-red-400/40 animate-pulse"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-red-400/40 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-red-400/40 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-red-400/40 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
              </div>


              {/* BlackWire: Tactical Chat Agent Block */}
              <BlackWire onMessageSaved={handleBlackWireMessageSaved} />

              {/* BlackBox Logs: Saved Transmissions Block */}
              <BlackBoxLogs key={blackBoxRefreshTrigger} />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/40 animate-pulse"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-red-400/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-red-400/40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GhostLayer;