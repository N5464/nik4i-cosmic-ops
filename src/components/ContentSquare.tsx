import React from 'react';
import { ContentItem } from '../data/contentData';

interface ContentSquareProps {
  item: ContentItem;
  onClick: (item: ContentItem) => void;
}

const ContentSquare: React.FC<ContentSquareProps> = ({ item, onClick }) => {
  return (
    <div 
      className="group relative cursor-pointer transition-all duration-500 hover:scale-105"
      onClick={() => onClick(item)}
    >
      {/* Main Square Container */}
      <div 
        className="w-48 h-48 border border-cyan-400/60 hover:border-cyan-300/80 transition-all duration-500 backdrop-blur-sm rounded-sm relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(14, 165, 233, 0.05))',
          filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.4))',
        }}
      >
        {/* Inner Glow Layer */}
        <div 
          className="absolute inset-1 border border-cyan-300/40 transition-all duration-500 group-hover:border-cyan-200/60 backdrop-blur-sm rounded-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(14, 165, 233, 0.03))',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          {/* Title */}
          <div>
            <h3 className="text-cyan-300 font-mono text-sm font-bold mb-3 leading-tight group-hover:text-cyan-200 transition-colors duration-300">
              {item.name}
            </h3>
            
            {/* Description Preview */}
            <p className="text-cyan-400/80 font-mono text-xs leading-relaxed group-hover:text-cyan-300/90 transition-colors duration-300">
              {item.descriptionPreview}
            </p>
          </div>

          {/* Access Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400/60 font-mono text-xs">CLASSIFIED</span>
            </div>
            <div className="text-cyan-400/40 font-mono text-xs group-hover:text-cyan-300/60 transition-colors duration-300">
              ACCESS →
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className="w-full h-full border border-cyan-400/50 animate-pulse rounded-sm"
            style={{ filter: 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.6))' }}
          />
        </div>

        {/* Corner Accent */}
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 group-hover:border-cyan-300/80 transition-colors duration-300"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 group-hover:border-cyan-300/80 transition-colors duration-300"></div>
      </div>
    </div>
  );
};

export default ContentSquare;