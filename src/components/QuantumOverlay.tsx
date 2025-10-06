import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { operatorProfileData, ContentItem } from '../data/operatorProfileData';

interface QuantumOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const QuantumOverlay: React.FC<QuantumOverlayProps> = ({ isVisible, onClose }) => {
  const [showInternalContent, setShowInternalContent] = useState(false);
  const [typingComplete, setTypingComplete] = useState<{[key: string]: boolean}>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Small delay to let overlay background render first
      const timer = setTimeout(() => {
        setShowInternalContent(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setShowInternalContent(false);
      setTypingComplete({});
    }
  }, [isVisible]);

  // Reset scroll position when overlay becomes visible
  useEffect(() => {
    if (isVisible && showInternalContent && scrollContainerRef.current) {
      // Use requestAnimationFrame + setTimeout for robust scroll reset
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }, 300);
      });
    }
  }, [isVisible, showInternalContent]);

  // Handle typing animation completion
  const handleTypingComplete = (elementId: string) => {
    setTimeout(() => {
      setTypingComplete(prev => ({ ...prev, [elementId]: true }));
    }, 320); // Match typing animation duration
  };

  // Start typing animations when content becomes visible
  useEffect(() => {
    if (showInternalContent) {
      // Start main header typing
      setTimeout(() => handleTypingComplete('main-header'), operatorProfileData.mainHeader.typingDelay);
      
      // Start section headers with their defined delays
      operatorProfileData.sections.forEach(section => {
        if (section.typingDelay) {
          setTimeout(() => handleTypingComplete(section.id), section.typingDelay);
        }
        
        // Handle sub-headers within content
        section.content.forEach((item, index) => {
          if (typeof item === 'object' && item.type === 'subheader' && item.typingDelay) {
            setTimeout(() => handleTypingComplete(`${section.id}-subheader-${index}`), item.typingDelay);
          }
        });
      });
    }
  }, [showInternalContent]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-900 transition-opacity duration-300 z-[9999]"
      onClick={handleBackdropClick}
    >
      {/* Universal High-End Close Button */}
      <button
        onClick={handleCloseClick}
        className="fixed top-6 right-6 w-10 h-10 lg:w-12 lg:h-12 bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-500/50 hover:border-cyan-400/70 rounded-md transition-all duration-300 z-[10000] button-press hover-lift group shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-400/40"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <X className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-200 group-hover:text-cyan-100 transition-colors duration-300" 
             style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.9))' }} />
        </div>
      </button>

      {/* Main Content */}
      <div ref={scrollContainerRef} className="h-full overflow-y-auto scrollbar-hide p-8">
        <div className="max-w-4xl lg:px-24">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 ${showInternalContent ? 'staggered-item' : 'opacity-0'}`}>
            <h1 className="text-cyan-300/70 font-cormorant-garamond text-xl sm:text-2xl lg:text-3xl font-bold">
              <span 
                className={`typing-text ${typingComplete['main-header'] ? 'typing-complete' : ''}`}
                style={{ animationDelay: showInternalContent ? `${operatorProfileData.mainHeader.typingDelay}ms` : undefined }}
              >
                {operatorProfileData.mainHeader.text}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`flex items-center space-x-2 mb-8 ${showInternalContent ? 'staggered-item' : 'opacity-0'}`}
               style={{ animationDelay: showInternalContent ? '200ms' : undefined }}>
            <span 
              className="text-cyan-400/80 font-cinzel text-lg sm:text-xl font-semibold"
            >
              {operatorProfileData.subtitle.text}
            </span>
          </div>

          {/* Dynamic Sections */}
          {operatorProfileData.sections.map((section, sectionIndex) => (
            <React.Fragment key={section.id}>
              {/* Section */}
              <div className={`mb-8 ${showInternalContent ? 'staggered-item' : 'opacity-0'}`}
                   style={{ animationDelay: showInternalContent ? `${section.staggeredItemDelay}ms` : undefined }}>
                {/* Section Title */}
                {section.title && (
                  <div className="flex items-center space-x-3 mb-4">
                    <h2 className="text-cyan-300/80 font-cormorant-garamond text-lg font-semibold">
                      {section.typingDelay ? (
                        <span 
                          className={`typing-text ${typingComplete[section.id] ? 'typing-complete' : ''}`}
                          style={{ animationDelay: showInternalContent ? `${section.typingDelay}ms` : undefined }}
                        >
                          {section.title}
                        </span>
                      ) : (
                        section.title
                      )}
                    </h2>
                  </div>
                )}
                
                {/* Section Content */}
                <div className="text-cyan-400 font-cinzel text-sm leading-relaxed">
                  {section.content.map((item, itemIndex) => {
                    const baseDelay = section.staggeredItemDelay + 200 + (itemIndex * 30);
                    
                    if (typeof item === 'string') {
                      if (item === '') {
                        return <p key={itemIndex} className="mb-4"></p>;
                      }
                      
                      return (
                        <p 
                          key={itemIndex}
                          className={`slide-in-body ${showInternalContent ? '' : 'opacity-0'}`}
                          style={{ 
                            whiteSpace: 'pre-wrap',
                            animationDelay: showInternalContent ? `${baseDelay}ms` : undefined 
                          }}
                        >
                          {item}
                        </p>
                      );
                    } else if (item.type === 'subheader') {
                      const subheaderKey = `${section.id}-subheader-${itemIndex}`;
                      return (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <span 
                            className={`${item.className || 'text-cyan-400 font-cinzel text-base sm:text-lg lg:text-xl leading-relaxed'} ${
                              item.typingDelay ? 
                                `typing-text ${typingComplete[subheaderKey] ? 'typing-complete' : ''}` : 
                                `slide-in-body ${showInternalContent ? '' : 'opacity-0'}`
                            }`}
                            style={{ 
                              animationDelay: showInternalContent ? 
                                `${item.typingDelay || baseDelay}ms` : undefined 
                            }}
                          >
                            {item.text}
                          </span>
                        </div>
                      );
                    } else if (item.type === 'link') {
                      return (
                        <p 
                          key={itemIndex}
                          className={`slide-in-body ${showInternalContent ? '' : 'opacity-0'}`}
                          style={{ 
                            animationDelay: showInternalContent ? `${baseDelay}ms` : undefined 
                          }}
                        >
                          <a 
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-300 font-cinzel"
                          >
                            {item.text}
                          </a>
                        </p>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>

              {/* Separator after each section (except the last one) */}
              {sectionIndex < operatorProfileData.sections.length - 1 && (
                <div className={`text-center text-cyan-400/60 font-cinzel text-sm mb-8 ${showInternalContent ? 'staggered-item' : 'opacity-0'}`}
                     style={{ animationDelay: showInternalContent ? `${section.staggeredItemDelay + 100}ms` : undefined }}>
                  »━━━━━━━━━━»
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Bottom Right Version */}
          <div className={`flex justify-end ${showInternalContent ? 'staggered-item' : 'opacity-0'}`}
               style={{ animationDelay: showInternalContent ? '9090ms' : undefined }}>
            <span className="text-cyan-400/60 font-cinzel text-xs">ETHEREAL.V1.0</span>
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/30 animate-pulse" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/30 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
};

export default QuantumOverlay;