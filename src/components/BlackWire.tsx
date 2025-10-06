import React, { useState, useEffect, useRef } from 'react';
import { Send, Save, Loader2, MessageSquare, RotateCcw, Bot } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isSaved?: boolean;
}

interface BlackWireProps {
  onMessageSaved?: () => void;
}

const BlackWire: React.FC<BlackWireProps> = ({ onMessageSaved }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savingMessageId, setSavingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate new session ID on component mount
  useEffect(() => {
    const newSessionId = `bw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Auto-scroll to bottom when new messages arrive (only within chat container)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Store user message in database
    try {
      await supabase
        .from('blackwire_messages')
        .insert([
          {
            session_id: sessionId,
            sender: 'user',
            message_content: userMessage.content,
            user_id: 'demigod_owner'
          }
        ]);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    try {
      // Send to Cloudflare webhook
      const response = await fetch('https://worm-relay.nirmalsolanki-business.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: 'blackwire',
          session_id: sessionId,
          reply: userMessage.content
        }),
      });

      const agentReply = await response.text();
      
      const agentMessage: ChatMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        content: agentReply,
        timestamp: new Date(),
      };

      // Add agent message to chat
      setMessages(prev => [...prev, agentMessage]);

      // Store agent message in database
      try {
        await supabase
          .from('blackwire_messages')
          .insert([
            {
              session_id: sessionId,
              sender: 'agent',
              message_content: agentMessage.content,
              user_id: 'demigod_owner'
            }
          ]);
      } catch (error) {
        console.error('Error saving agent message:', error);
      }

    } catch (error) {
      console.error('Error communicating with BlackWire agent:', error);
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        sender: 'agent',
        content: 'ERROR: Connection to BlackWire agent failed. Signal lost.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMessage = async (message: ChatMessage) => {
    if (message.sender !== 'agent') return;
    
    setSavingMessageId(message.id);
    
    try {
      // Update the message in database to mark as saved
      const { error } = await supabase
        .from('blackwire_messages')
        .update({ is_saved: true })
        .eq('session_id', sessionId)
        .eq('sender', 'agent')
        .eq('message_content', message.content);

      if (error) {
        console.error('Error saving message:', error);
      } else {
        // Update local state
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, isSaved: true }
              : msg
          )
        );
        
        // Notify parent component
        onMessageSaved?.();
      }
    } catch (error) {
      console.error('Error in handleSaveMessage:', error);
    } finally {
      setSavingMessageId(null);
    }
  };

  const handleNewSession = () => {
    const newSessionId = `bw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setMessages([]);
    setInputMessage('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      className="bg-black/60 border-2 border-purple-400/40 backdrop-blur-md relative overflow-hidden mb-6"
      style={{
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139, 92, 246, 0.3)',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(139, 92, 246, 0.05) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(139, 92, 246, 0.05) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(168, 85, 247, 0.05) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(168, 85, 247, 0.05) 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        />
      </div>

      {/* Header */}
      <div className="border-b border-purple-400/30 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageSquare className="w-6 h-6 text-purple-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-80"></div>
            </div>
            <h2 className="text-purple-200 font-audiowide text-xl font-bold tracking-wider">
              NIGHTWIRE
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full opacity-80"></div>
              <span className="text-purple-300/70 font-mono text-xs">SESSION: {sessionId.slice(-8).toUpperCase()}</span>
            </div>
            <button
              onClick={handleNewSession}
              className="group p-2 border border-purple-500/50 bg-purple-900/30 hover:bg-purple-800/50 transition-all duration-300 button-press hover-lift"
              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              title="New Session"
            >
              <RotateCcw className="w-4 h-4 text-purple-300 group-hover:text-purple-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="h-80 overflow-y-auto scrollbar-hide p-4 space-y-4 relative z-10"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="relative">
                <MessageSquare className="w-12 h-12 text-purple-400/40 mx-auto" />
              </div>
              <span className="text-purple-300/70 font-mono text-sm">Neural link established...</span>
              <p className="text-purple-400/50 font-mono text-xs">Initialize secure communication</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} content-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`max-w-[85%] relative group ${
                message.sender === 'user' 
                  ? 'bg-black/30 border-emerald-400/40 backdrop-blur-md' 
                  : 'bg-black/30 border-purple-400/40 backdrop-blur-md'
              } border-2 p-4 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
              style={{
                clipPath: message.sender === 'user' 
                  ? 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                  : 'polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                boxShadow: message.sender === 'user'
                  ? '0 0 10px rgba(16, 185, 129, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.3)'
                  : '0 0 10px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.3)'
              }}>
                
                {/* Message Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      message.sender === 'user' 
                        ? 'bg-black/40 border border-emerald-400/50' 
                        : 'bg-black/40 border border-purple-400/50'
                    }`}>
                      {message.sender === 'user' ? (
                        <span className="text-lg">🥷🏻</span>
                      ) : (
                        <Bot className="w-4 h-4 text-purple-300" />
                      )}
                    </div>
                    <span className="text-xs font-mono text-white/60">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {/* Save Button for Agent Messages */}
                  {message.sender === 'agent' && (
                    <button
                      onClick={() => handleSaveMessage(message)}
                      disabled={savingMessageId === message.id || message.isSaved}
                      className={`group p-2 border-2 transition-all duration-300 disabled:opacity-50 button-press ${
                        message.isSaved 
                          ? 'border-emerald-400/60 bg-emerald-900/40' 
                          : 'border-purple-400/50 bg-purple-900/30 hover:bg-purple-800/50 hover:border-purple-300/70'
                      }`}
                      style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                      title={message.isSaved ? 'Saved to BlackBox' : 'Save to BlackBox'}
                    >
                      {savingMessageId === message.id ? (
                        <Loader2 className="w-4 h-4 text-purple-300 enhanced-spinner" />
                      ) : message.isSaved ? (
                        <Save className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Save className="w-4 h-4 text-purple-300 group-hover:text-purple-200" />
                      )}
                    </button>
                  )}
                </div>

                {/* Message Content */}
                <div className={`font-mono text-sm leading-relaxed ${
                  message.sender === 'user' ? 'text-emerald-100' : 'text-purple-100'
                }`}>
                  <pre className="whitespace-pre-wrap break-words">{message.content}</pre>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  message.sender === 'user' ? 'bg-emerald-400/10' : 'bg-purple-400/10'
                }`}
                style={{
                  clipPath: message.sender === 'user' 
                    ? 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                    : 'polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                }}></div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black/40 border-2 border-purple-400/50 p-4 max-w-[85%] backdrop-blur-md"
                 style={{ 
                   clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                   boxShadow: '0 0 10px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-purple-400/50">
                  <Bot className="w-4 h-4 text-purple-300" />
                </div>
                <Loader2 className="w-5 h-5 text-purple-300 enhanced-spinner" />
                <span className="text-purple-200 font-mono text-sm">Neural processing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-400/30 p-4 relative z-10">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-black/50 border-2 border-purple-400/50 px-4 py-3 text-purple-100 font-mono mobile-input focus:border-purple-300/70 focus:outline-none transition-all duration-300 placeholder-purple-300/50 input-focus-glow backdrop-blur-md rounded-sm"
            placeholder="Enter neural command..."
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="group px-3 sm:px-6 py-3 border-2 border-purple-500/50 bg-black/60 hover:bg-black/70 hover:border-purple-400/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm font-bold button-press hover-lift backdrop-blur-md flex items-center justify-center"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 enhanced-spinner" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="text-purple-200 group-hover:text-purple-100 inline">
                TRANSMIT
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-purple-400/30 opacity-60"></div>
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-purple-400/30 opacity-60"></div>
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-400/30 opacity-60"></div>
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-purple-400/30 opacity-60"></div>
    </div>
  );
};

export default BlackWire;