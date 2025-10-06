import React, { useState } from 'react';
import { Zap, Save, Loader2, Swords, RotateCcw } from 'lucide-react';

interface DualBladeIntelProps {
  onSaveClip: (source: string, content: string, intel: string) => Promise<void>;
}

const DualBladeIntel: React.FC<DualBladeIntelProps> = ({ onSaveClip }) => {
  const [intel, setIntel] = useState('');
  const [claudeResult, setClaudeResult] = useState('');
  const [openaiResult, setOpenaiResult] = useState('');
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [openaiLoading, setOpenaiLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  
  // Check if module is active (has any content)
  const isModuleActive = intel.trim() !== '' || claudeResult !== '' || openaiResult !== '';

  const handleExecute = async () => {
    if (!intel.trim()) return;

    setExecuting(true);
    setClaudeLoading(true);
    setOpenaiLoading(true);
    setClaudeResult('');
    setOpenaiResult('');

    try {
      // First trigger - Claude
      const claudePromise = fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: 'dual-blade',
          mode: 'claudefire',
          intel: intel.trim()
        }),
      });

      // Second trigger - OpenAI
      const openaiPromise = fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: 'dual-blade',
          mode: 'openaifire',
          intel: intel.trim()
        }),
      });

      // Execute both requests simultaneously
      const [claudeResponse, openaiResponse] = await Promise.all([claudePromise, openaiPromise]);

      // Process Claude response
      const claudeText = await claudeResponse.text();
      setClaudeResult(claudeText);
      setClaudeLoading(false);

      // Process OpenAI response
      const openaiText = await openaiResponse.text();
      setOpenaiResult(openaiText);
      setOpenaiLoading(false);

    } catch (error) {
      console.error('Error executing dual blade intel:', error);
      setClaudeResult('ERROR: Failed to get Claude response');
      setOpenaiResult('ERROR: Failed to get OpenAI response');
      setClaudeLoading(false);
      setOpenaiLoading(false);
    } finally {
      setExecuting(false);
    }
  };

  const handleSaveClip = async (source: string, content: string) => {
    try {
      await onSaveClip(source, content, intel.trim());
    } catch (error) {
      console.error('Error saving clip:', error);
    }
  };

  const handleResetModule = () => {
    setIntel('');
    setClaudeResult('');
    setOpenaiResult('');
    setClaudeLoading(false);
    setOpenaiLoading(false);
    setExecuting(false);
  };

  return (
    <div 
      className="bg-slate-800/60 border border-slate-400/30 backdrop-blur-sm relative overflow-hidden mb-6"
      style={{
        boxShadow: '0 0 30px rgba(148, 163, 184, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.8)',
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
    >
      {/* Header */}
      <div className="border-b border-slate-400/20 p-4">
        <div className="flex items-center space-x-3">
          <Swords className="w-6 h-6 text-slate-300" />
          <h2 className="text-slate-300 font-mono text-lg font-bold tracking-wider">
            ⚔️ INTEL MODULE: DUAL BLADE INTEL
          </h2>
          <div className="flex items-center space-x-1 ml-auto">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-slate-400 font-mono text-xs">CLAUDE</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="text-slate-400 font-mono text-xs">OPENAI</span>
          </div>
        </div>
      </div>
      
      {/* Reset Button - Only visible when module is active */}
      {isModuleActive && (
        <button
          onClick={handleResetModule}
          className="absolute top-4 right-4 group p-2 border border-slate-500/40 bg-slate-700/40 hover:bg-slate-600/40 transition-all duration-300 button-press hover-lift"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
          title="Reset Module"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
        </button>
      )}

      {/* Input Section */}
      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="text"
            value={intel}
            onChange={(e) => setIntel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !executing && handleExecute()}
            className="w-full flex-1 bg-black/40 border border-slate-400/40 px-4 py-3 text-slate-300 font-mono mobile-input focus:border-slate-300 focus:outline-none transition-colors duration-300 placeholder-slate-400/50"
            placeholder="Enter your intel query..."
            disabled={executing}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}
          />
          <button
            onClick={handleExecute}
            disabled={!intel.trim() || executing}
            className="w-full sm:w-auto group px-6 py-3 border border-red-500/40 bg-red-900/20 hover:bg-red-900/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm font-bold button-press hover-lift"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            <div className="flex items-center space-x-2">
              {executing ? (
                <Loader2 className="w-4 h-4 enhanced-spinner" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span className="text-red-400 group-hover:text-red-300">
                {executing ? 'EXECUTING...' : 'EXECUTE'}
              </span>
            </div>
          </button>
        </div>

        {/* Results Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Claude Panel */}
          <div 
            className="bg-black/60 border border-blue-400/30 relative overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            {/* Panel Header */}
            <div className="border-b border-blue-400/20 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-mono text-sm font-bold">CLAUDE RESPONSE</span>
              </div>
              {claudeResult && !claudeLoading && (
                <button
                  onClick={() => handleSaveClip('Claude', claudeResult)}
                  className="group px-2 py-1 border border-green-500/40 bg-green-900/20 hover:bg-green-900/40 transition-all duration-300 button-press hover-lift"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)',
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <Save className="w-3 h-3 text-green-400 group-hover:text-green-300" />
                    <span className="text-green-400 group-hover:text-green-300 font-mono text-xs">SAVE</span>
                  </div>
                </button>
              )}
            </div>

            {/* Panel Content */}
            <div className="p-4 min-h-[200px]">
              {claudeLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-blue-400 enhanced-spinner" />
                    <span className="text-blue-400 font-mono text-sm">PROCESSING...</span>
                  </div>
                </div>
              ) : claudeResult ? (
                <pre className="text-blue-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words content-fade-in-up overflow-y-auto max-h-64 scrollbar-hide">
                  {claudeResult}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <span className="text-blue-400/40 font-mono text-sm">Awaiting Claude response...</span>
                </div>
              )}
            </div>
          </div>

          {/* OpenAI Panel */}
          <div 
            className="bg-black/60 border border-green-400/30 relative overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
          >
            {/* Panel Header */}
            <div className="border-b border-green-400/20 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm font-bold">OPENAI RESPONSE</span>
              </div>
              {openaiResult && !openaiLoading && (
                <button
                  onClick={() => handleSaveClip('OpenAI', openaiResult)}
                  className="group px-2 py-1 border border-green-500/40 bg-green-900/20 hover:bg-green-900/40 transition-all duration-300 button-press hover-lift"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)',
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <Save className="w-3 h-3 text-green-400 group-hover:text-green-300" />
                    <span className="text-green-400 group-hover:text-green-300 font-mono text-xs">SAVE</span>
                  </div>
                </button>
              )}
            </div>

            {/* Panel Content */}
            <div className="p-4 min-h-[200px]">
              {openaiLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-green-400 enhanced-spinner" />
                    <span className="text-green-400 font-mono text-sm">PROCESSING...</span>
                  </div>
                </div>
              ) : openaiResult ? (
                <pre className="text-green-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words content-fade-in-up overflow-y-auto max-h-64 scrollbar-hide">
                  {openaiResult}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <span className="text-green-400/40 font-mono text-sm">Awaiting OpenAI response...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-400/40 animate-pulse"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-400/40 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-400/40 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-400/40 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
    </div>
  );
};

export default DualBladeIntel;