import React, { useState, useEffect } from 'react';
import { Archive, Trash2, Clock, MessageSquare, User, Bot } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface SavedMessage {
  id: number;
  created_at: string;
  session_id: string;
  sender: 'user' | 'agent';
  message_content: string;
  is_saved: boolean;
}

const BlackBoxLogs: React.FC = () => {
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  // Fetch saved messages from Supabase
  const fetchSavedMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('blackwire_messages')
        .select('*')
        .eq('user_id', 'demigod_owner')
        .eq('is_saved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved messages:', error);
      } else {
        setSavedMessages(data || []);
      }
    } catch (error) {
      console.error('Error in fetchSavedMessages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Execute the actual deletion
  const executeDeleteMessage = async (id: number) => {
    setDeletingId(id);
    setConfirmingDeleteId(null);
    try {
      const { error } = await supabase
        .from('blackwire_messages')
        .delete()
        .eq('id', id)
        .eq('user_id', 'demigod_owner');

      if (error) {
        console.error('Error deleting message:', error);
      } else {
        // Immediately refresh the messages list after successful deletion
        await fetchSavedMessages();
      }
    } catch (error) {
      console.error('Error in deleteMessage:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle delete button click (two-step process)
  const handleDeleteClick = (id: number) => {
    if (confirmingDeleteId === id) {
      // Second click - execute deletion
      executeDeleteMessage(id);
    } else {
      // First click - set to confirm state
      setConfirmingDeleteId(id);
    }
  };

  // Set up real-time subscription and initial fetch
  useEffect(() => {
    fetchSavedMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel('blackwire_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blackwire_messages',
          filter: 'user_id=eq.demigod_owner'
        },
        (payload) => {
          console.log('BlackBox real-time update:', payload);
          fetchSavedMessages(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getSenderIcon = (sender: string) => {
    return sender === 'user' ? User : Bot;
  };

  const getSenderColor = (sender: string) => {
    return sender === 'user' 
      ? 'text-emerald-300 border-emerald-400/50 bg-emerald-900/30'
      : 'text-purple-300 border-purple-400/50 bg-purple-900/30';
  };

  const getSessionColor = (sessionId: string) => {
    // Generate a consistent color based on session ID
    const hash = sessionId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = [
      'text-violet-400',
      'text-indigo-400', 
      'text-cyan-400',
      'text-amber-400',
      'text-rose-400',
      'text-emerald-400'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div 
      className="bg-black/60 border-2 border-emerald-400/40 backdrop-blur-md relative overflow-hidden"
      style={{
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.3)',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
              linear-gradient(45deg, rgba(16, 185, 129, 0.03) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(34, 197, 94, 0.03) 25%, transparent 25%)
            `,
            backgroundSize: '40px 40px, 60px 60px, 20px 20px, 20px 20px',
          }}
        />
      </div>

      {/* Header */}
      <div className="border-b border-emerald-400/30 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Archive className="w-6 h-6 text-emerald-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full opacity-80"></div>
            </div>
            <h2 className="text-emerald-200 font-teko text-2xl font-bold tracking-wider">
              ARCHIVE NEXUS
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-emerald-300/70 font-mono text-sm">
            <span>{savedMessages.length} ARCHIVED</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-80"></div>
            <span>LIVE SYNC</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-emerald-400/40 border-t-emerald-300 rounded-full enhanced-spinner"></div>
              <span className="text-emerald-300 font-mono text-sm">Scanning neural archives...</span>
            </div>
          </div>
        ) : savedMessages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <div className="relative">
                <Archive className="w-12 h-12 text-emerald-400/40 mx-auto" />
              </div>
              <span className="text-emerald-300/70 font-mono text-sm">Archive vault empty</span>
              <p className="text-emerald-400/50 font-mono text-xs">Save BlackWire transmissions to populate neural logs</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
            {savedMessages.map((message, index) => {
              const SenderIcon = getSenderIcon(message.sender);
              return (
                <div 
                  key={message.id}
                  className="bg-black/30 border-2 border-emerald-500/40 p-4 relative content-fade-in-up hover-lift hover:scale-[1.02] transition-all duration-300 group backdrop-blur-md"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.3)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${getSenderColor(message.sender)}`}>
                        {message.sender === 'user' ? (
                          <span className="text-sm">🥷🏻</span>
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-emerald-300/60">
                          <Clock className="w-3 h-3" />
                          <span className="font-mono text-xs">{formatDate(message.created_at)}</span>
                        </div>
                        <div className={`font-mono text-xs ${getSessionColor(message.session_id)}`}>
                          SESSION: {message.session_id.slice(-8).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(message.id)}
                      disabled={deletingId === message.id}
                      className={`group p-2 border-2 transition-all duration-300 disabled:opacity-50 button-press ${
                        confirmingDeleteId === message.id
                          ? 'border-orange-500/60 bg-orange-900/40 hover:bg-orange-900/60'
                          : 'border-red-500/50 bg-red-900/30 hover:bg-red-900/50 hover:border-red-400/70'
                      }`}
                      style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                    >
                      {deletingId === message.id ? (
                        <div className="w-4 h-4 border-2 border-red-400/40 border-t-red-300 rounded-full enhanced-spinner"></div>
                      ) : confirmingDeleteId === message.id ? (
                        <span className="text-orange-300 group-hover:text-orange-200 font-mono text-xs font-bold">PURGE</span>
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                      )}
                    </button>
                  </div>

                  {/* Message Content */}
                  <div className="bg-black/40 border border-emerald-500/30 p-4 backdrop-blur-md"
                       style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                    <pre className="text-emerald-200 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words max-h-32 overflow-y-auto terminal-scrollbar">
                      {message.message_content}
                    </pre>
                  </div>

                  {/* Session Indicator */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-3 h-3 text-emerald-400/60" />
                      <span className="text-emerald-400/60 font-mono text-xs">
                        NEURAL TRANSMISSION
                      </span>
                    </div>
                    <div className="text-emerald-400/40 font-mono text-xs">
                      ARCHIVE ID: {message.id}
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-emerald-400/10"
                       style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400/30 opacity-60"></div>
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400/30 opacity-60"></div>
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400/30 opacity-60"></div>
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400/30 opacity-60"></div>
    </div>
  );
};

export default BlackBoxLogs;