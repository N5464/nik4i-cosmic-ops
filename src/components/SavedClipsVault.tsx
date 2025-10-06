import React, { useState, useEffect } from 'react';
import { Archive, Trash2, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface SavedClip {
  id: number;
  created_at: string;
  user_id: string;
  description: string;
  source: string;
  intel_query: string;
  tags: string;
  notes: string;
}

interface SavedClipsVaultProps {
  onAddClip?: (source: string, content: string, intel: string) => Promise<void>;
}

const SavedClipsVault: React.FC<SavedClipsVaultProps> = ({ onAddClip }) => {
  const [clips, setClips] = useState<SavedClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  // Fetch clips from Supabase
  const fetchClips = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_clips')
        .select('*')
        .eq('user_id', 'demigod_owner')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clips:', error);
      } else {
        setClips(data || []);
      }
    } catch (error) {
      console.error('Error in fetchClips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new clip to Supabase
  const addClip = async (source: string, content: string, intel: string) => {
    try {
      const { error } = await supabase
        .from('saved_clips')
        .insert([
          {
            user_id: 'demigod_owner',
            description: content,
            source: source,
            intel_query: intel,
            tags: `dual-blade,${source.toLowerCase()}`,
            notes: `Saved from Dual Blade Intel - ${new Date().toISOString()}`
          }
        ]);

      if (error) {
        console.error('Error adding clip:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in addClip:', error);
      throw error;
    }
  };

  // Execute the actual deletion
  const executeDeleteClip = async (id: number) => {
    setDeletingId(id);
    setConfirmingDeleteId(null);
    try {
      const { error } = await supabase
        .from('saved_clips')
        .delete()
        .eq('id', id)
        .eq('user_id', 'demigod_owner');

      if (error) {
        console.error('Error deleting clip:', error);
      } else {
        // Immediately refresh the clips list after successful deletion
        await fetchClips();
      }
    } catch (error) {
      console.error('Error in deleteClip:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle delete button click (two-step process)
  const handleDeleteClick = (id: number) => {
    if (confirmingDeleteId === id) {
      // Second click - execute deletion
      executeDeleteClip(id);
    } else {
      // First click - set to confirm state
      setConfirmingDeleteId(id);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchClips();

    // Set up real-time subscription
    const subscription = supabase
      .channel('saved_clips_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_clips',
          filter: 'user_id=eq.demigod_owner'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchClips(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Expose addClip function to parent component
  useEffect(() => {
    if (onAddClip) {
      // This is a bit of a hack to expose the addClip function to the parent
      // In a more complex app, you might use a ref or context
      (window as any).addClipToVault = addClip;
    }
  }, [onAddClip]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'claude':
        return 'text-blue-400 border-blue-400/40 bg-blue-900/20';
      case 'openai':
        return 'text-green-400 border-green-400/40 bg-green-900/20';
      default:
        return 'text-slate-400 border-slate-400/40 bg-slate-900/20';
    }
  };

  return (
    <div 
      className="bg-slate-800/60 border border-slate-400/30 backdrop-blur-sm relative overflow-hidden"
      style={{
        boxShadow: '0 0 30px rgba(148, 163, 184, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.8)',
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
    >
      {/* Header */}
      <div className="border-b border-slate-400/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Archive className="w-6 h-6 text-slate-300" />
            <h2 className="text-slate-300 font-mono text-lg font-bold tracking-wider">
              🧱 SAVED CLIPS VAULT
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-slate-400/60 font-mono text-sm">
            <span>{clips.length} CLIPS</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>LIVE SYNC</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-slate-400/40 border-t-slate-300 rounded-full enhanced-spinner"></div>
              <span className="text-slate-300 font-mono text-sm">LOADING VAULT...</span>
            </div>
          </div>
        ) : clips.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Archive className="w-8 h-8 text-slate-400/40 mx-auto" />
              <span className="text-slate-400/60 font-mono text-sm">NO CLIPS SAVED YET</span>
              <p className="text-slate-500/60 font-mono text-xs">Execute Dual Blade Intel and save results to populate vault</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
            {clips.map((clip) => (
              <div 
                key={clip.id}
                className="bg-slate-700/40 border border-slate-500/30 p-4 relative content-fade-in-up hover-lift"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                {/* Clip Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 border rounded text-xs font-mono font-bold ${getSourceColor(clip.source)}`}>
                      {clip.source.toUpperCase()}
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400/60">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono text-xs">{formatDate(clip.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(clip.id)}
                    disabled={deletingId === clip.id}
                    className={`group p-2 border transition-all duration-300 disabled:opacity-50 button-press ${
                      confirmingDeleteId === clip.id
                        ? 'border-orange-500/60 bg-orange-900/40 hover:bg-orange-900/60'
                        : 'border-red-500/40 bg-red-900/20 hover:bg-red-900/40'
                    }`}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)' }}
                  >
                    {deletingId === clip.id ? (
                      <div className="w-3 h-3 border border-red-400/40 border-t-red-300 rounded-full enhanced-spinner"></div>
                    ) : confirmingDeleteId === clip.id ? (
                      <span className="text-orange-300 group-hover:text-orange-200 font-mono text-xs font-bold">CONFIRM</span>
                    ) : (
                      <Trash2 className="w-3 h-3 text-red-400 group-hover:text-red-300" />
                    )}
                  </button>
                </div>

                {/* Original Query */}
                {clip.intel_query && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-3 h-3 text-slate-400/60" />
                      <span className="text-slate-400/60 font-mono text-xs font-bold">ORIGINAL QUERY:</span>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-500/20 p-2 rounded-sm">
                      <p className="text-slate-300/80 font-mono text-xs italic">"{clip.intel_query}"</p>
                    </div>
                  </div>
                )}

                {/* Clip Content */}
                <div className="bg-black/40 border border-slate-500/20 p-3 rounded-sm">
                  <pre className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words max-h-32 overflow-y-auto terminal-scrollbar">
                    {clip.description}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-400/40 animate-pulse"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-400/40 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-400/40 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-400/40 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
    </div>
  );
};

export default SavedClipsVault;