import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Save, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface MiniBunkerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface BunkerCred {
  id: string;
  password: string;
  created_at: string;
}

const MiniBunker: React.FC<MiniBunkerProps> = ({ isVisible, onClose }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [bunkerPassword, setBunkerPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [credentials, setCredentials] = useState<BunkerCred[]>([]);
  const [newId, setNewId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null);
  const [passwordTimeout, setPasswordTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch credentials from Supabase
  const fetchCredentials = async () => {
    if (!isUnlocked) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bunker_creds')
        .select('*')
        .eq('user_id', 'demigod_owner')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching credentials:', error);
      } else {
        setCredentials(data || []);
      }
    } catch (error) {
      console.error('Error in fetchCredentials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save new credential
  const saveCredential = async () => {
    if (!newId.trim() || !newPassword.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('bunker_creds')
        .insert([
          {
            id: newId.trim(),
            password: newPassword.trim(),
            user_id: 'demigod_owner'
          }
        ]);

      if (error) {
        console.error('Error saving credential:', error);
      } else {
        setNewId('');
        setNewPassword('');
        await fetchCredentials();
      }
    } catch (error) {
      console.error('Error in saveCredential:', error);
    } finally {
      setSaving(false);
    }
  };

  // Delete credential
  const deleteCredential = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('bunker_creds')
        .delete()
        .eq('id', id)
        .eq('user_id', 'demigod_owner');

      if (error) {
        console.error('Error deleting credential:', error);
      } else {
        await fetchCredentials();
      }
    } catch (error) {
      console.error('Error in deleteCredential:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle password visibility with 3-second auto-hide
  const togglePasswordVisibility = (credId: string) => {
    // If password is already visible for this credential, hide it immediately
    if (visiblePasswordId === credId) {
      setVisiblePasswordId(null);
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
        setPasswordTimeout(null);
      }
      return;
    }

    // Clear any existing timeout
    if (passwordTimeout) {
      clearTimeout(passwordTimeout);
    }

    // Show password for this credential
    setVisiblePasswordId(credId);

    // Set timeout to hide after 3 seconds
    const timeout = setTimeout(() => {
      setVisiblePasswordId(null);
      setPasswordTimeout(null);
    }, 3000);

    setPasswordTimeout(timeout);
  };

  // Handle unlock
  const handleUnlock = async () => {
    if (!bunkerPassword.trim()) {
      setErrorMessage('Please enter a password');
      return;
    }

    try {
      const response = await fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: 'silent',
          mode: 'mini-bunker',
          pass: bunkerPassword,
        }),
      });

      const responseText = await response.text();

      if (responseText.trim() === 'Accepted') {
        setIsUnlocked(true);
        setErrorMessage('');
        setBunkerPassword('');
      } else if (responseText.trim() === 'Rejected') {
        setErrorMessage('ACCESS DENIED');
        setBunkerPassword('');
        setTimeout(() => setErrorMessage(''), 2000);
      } else {
        setErrorMessage('Connection error. Please try again.');
        setBunkerPassword('');
        setTimeout(() => setErrorMessage(''), 2000);
      }
    } catch (error) {
      console.error('Error during unlock:', error);
      setErrorMessage('Connection error. Please try again.');
      setBunkerPassword('');
      setTimeout(() => setErrorMessage(''), 2000);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setIsUnlocked(false);
      setBunkerPassword('');
      setErrorMessage('');
      setNewId('');
      setNewPassword('');
      setCredentials([]);
      setVisiblePasswordId(null);
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
        setPasswordTimeout(null);
      }
    }
  }, [isVisible]);

  // Fetch credentials when unlocked
  useEffect(() => {
    if (isVisible && isUnlocked) {
      fetchCredentials();
    }
  }, [isVisible, isUnlocked]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
      }
    };
  }, [passwordTimeout]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000]"
      onClick={handleBackdropClick}
    >
      <div 
        className="modal-scale-in bg-slate-800 border-2 border-slate-400/50 w-full max-w-md mx-4 relative overflow-hidden"
        style={{
          boxShadow: '0 0 40px rgba(148, 163, 184, 0.4), inset 0 0 60px rgba(0, 0, 0, 0.8)',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-500/40">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-slate-300" />
            <h2 className="text-slate-300 font-mono text-lg font-bold tracking-wider">
              MINI BUNKER
            </h2>
          </div>
          <button
            onClick={onClose}
            className="group p-2 border border-slate-500/40 bg-slate-700/40 hover:bg-slate-600/40 transition-all duration-300"
            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isUnlocked ? (
            /* Unlock Screen */
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400 font-mono text-sm">ENTER ACCESS CODE</p>
              </div>
              
              <input
                type="password"
                value={bunkerPassword}
                onChange={(e) => setBunkerPassword(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleUnlock)}
                className="w-full bg-slate-700/60 border border-slate-500/40 rounded-sm px-4 py-3 text-slate-300 font-mono mobile-input focus:border-slate-400 focus:outline-none transition-colors duration-300 input-focus-glow"
                placeholder="••••••••"
                autoFocus
              />

              {errorMessage && (
                <div className="text-red-400 font-mono text-xs text-center animate-pulse">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleUnlock}
                className="w-full group px-4 py-3 border border-green-500/40 bg-green-900/20 hover:bg-green-900/40 transition-all duration-300 font-mono text-sm button-press hover-lift"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Unlock className="w-4 h-4" />
                  <span className="text-green-400 group-hover:text-green-300">UNLOCK</span>
                </div>
              </button>
            </div>
          ) : (
            /* Bunker Content */
            <div className="space-y-4">
              {/* Input Fields */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full bg-slate-700/60 border border-slate-500/40 rounded-sm px-4 py-2 text-slate-300 font-mono mobile-input focus:border-slate-400 focus:outline-none transition-colors duration-300 input-focus-glow"
                  placeholder="ID"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, saveCredential)}
                  className="w-full bg-slate-700/60 border border-slate-500/40 rounded-sm px-4 py-2 text-slate-300 font-mono mobile-input focus:border-slate-400 focus:outline-none transition-colors duration-300 input-focus-glow"
                  placeholder="PASS"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveCredential}
                disabled={!newId.trim() || !newPassword.trim() || saving}
                className="w-full group px-4 py-2 border border-blue-500/40 bg-blue-900/20 hover:bg-blue-900/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm button-press hover-lift"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
              >
                <div className="flex items-center justify-center space-x-2">
                  {saving ? (
                    <div className="w-4 h-4 border border-blue-400/40 border-t-blue-300 rounded-full enhanced-spinner"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="text-blue-400 group-hover:text-blue-300">
                    {saving ? 'SAVING...' : 'SAVE'}
                  </span>
                </div>
              </button>

              {/* Credentials List */}
              <div className="border-t border-slate-500/30 pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 font-mono text-xs">STORED CREDENTIALS</span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border border-slate-400/40 border-t-slate-300 rounded-full enhanced-spinner"></div>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto terminal-scrollbar scrollbar-hide space-y-2">
                    {credentials.length === 0 ? (
                      <div className="text-slate-500 font-mono text-xs text-center py-4">
                        NO CREDENTIALS STORED
                      </div>
                    ) : (
                      credentials.map((cred) => (
                        <div 
                          key={cred.id}
                          className="bg-slate-700/40 border border-slate-500/30 p-3 content-fade-in-up hover-lift"
                          style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-slate-300 font-mono text-sm font-bold truncate">
                                {cred.id}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="text-slate-400 font-mono text-xs truncate">
                                  {visiblePasswordId === cred.id ? cred.password : cred.password.replace(/./g, '•')}
                                </div>
                                <button
                                  onClick={() => togglePasswordVisibility(cred.id)}
                                  className="group p-1 border border-slate-500/40 bg-slate-600/40 hover:bg-slate-500/40 transition-all duration-300"
                                  style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 100%, 3px 100%)' }}
                                >
                                  {visiblePasswordId === cred.id ? (
                                    <EyeOff className="w-3 h-3 text-slate-300 group-hover:text-slate-200" />
                                  ) : (
                                    <Eye className="w-3 h-3 text-slate-400 group-hover:text-slate-300" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteCredential(cred.id)}
                              disabled={deletingId === cred.id}
                              className="group p-2 border border-red-500/40 bg-red-900/20 hover:bg-red-900/40 transition-all duration-300 disabled:opacity-50 ml-3 button-press"
                              style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
                            >
                              {deletingId === cred.id ? (
                                <div className="w-3 h-3 border border-red-400/40 border-t-red-300 rounded-full enhanced-spinner"></div>
                              ) : (
                                <Trash2 className="w-3 h-3 text-red-400 group-hover:text-red-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Corner Accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-slate-400/40 animate-pulse"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-slate-400/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-slate-400/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-slate-400/40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
};

export default MiniBunker;