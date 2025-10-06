import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Shield, FileText, Image, X } from 'lucide-react';
import { MissionItem, missionData } from '../data/missionData';

interface MissionFilesOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const MissionFilesOverlay: React.FC<MissionFilesOverlayProps> = ({ isVisible, onClose }) => {
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentMission = missionData[currentMissionIndex];

  // Early return if no mission data exists
  if (!currentMission) {
    return null;
  }

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

  const handleNextMission = () => {
    setCurrentMissionIndex((prev) => (prev + 1) % missionData.length);
  };

  const handlePrevMission = () => {
    setCurrentMissionIndex((prev) => (prev - 1 + missionData.length) % missionData.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 border-green-500/40';
      case 'in-progress':
        return 'text-yellow-400 border-yellow-500/40';
      case 'classified':
        return 'text-red-400 border-red-500/40';
      default:
        return 'text-amber-400 border-amber-500/40';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 transition-all duration-1000 ease-in-out ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{ zIndex: 9998 }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with tactical grid */}
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
              rgba(245, 158, 11, 0.03) 0%, 
              rgba(217, 119, 6, 0.02) 50%, 
              rgba(245, 158, 11, 0.03) 100%
            )
          `,
        }}
      >
        {/* Tactical Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              animationDuration: '4s',
            }}
          />
        </div>

        {/* Scanning Lines */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-amber-400/10 to-transparent h-px animate-pulse"
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
      </div>

      {/* Mission File Interface */}
      <div 
        className={`relative z-10 h-full flex flex-col transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        ref={overlayRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h1 className="text-amber-300 font-mono text-lg sm:text-2xl font-bold tracking-wider">
              {"> MISSION FILES ARCHIVE"}
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-amber-400/60 font-mono text-sm">
              <span>{currentMissionIndex + 1}</span>
              <span>/</span>
              <span>{missionData.length}</span>
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="group relative p-2 sm:p-3 border border-amber-500/40 bg-black/80 hover:bg-amber-900/20 transition-all duration-300 font-mono text-xs sm:text-sm"
            style={{ 
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)'
            }}
          >
            <div className="flex items-center space-x-2">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-amber-400 group-hover:text-amber-300 transition-colors duration-300 hidden sm:inline">
                [CLOSE ARCHIVE]
              </span>
            </div>
            <div className="absolute inset-0 border border-amber-400/0 group-hover:border-amber-400/40 transition-all duration-300"
                 style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)' }}></div>
          </button>
        </div>

        {/* Mission Content Area */}
        <div className="flex-1 p-4 sm:p-8 relative overflow-hidden">
          {/* Mission File Container */}
          <div 
            className="h-full border border-amber-400/30 bg-black/60 backdrop-blur-sm relative overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 50px rgba(245, 158, 11, 0.1), 0 0 30px rgba(245, 158, 11, 0.1)',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            }}
          >
            {/* File Header */}
            <div className="border-b border-amber-400/20 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  <div>
                    <h2 className="text-amber-300 font-mono text-lg sm:text-xl font-bold">
                      {currentMission?.title || "Loading..."}
                    </h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <span className="text-amber-400/60 font-mono text-xs">
                          {currentMission?.buildType || "Unknown"}
                        </span>
                      </div>
                      <div className={`px-2 py-1 border rounded text-xs font-mono ${getStatusColor(currentMission.status)}`}>
                        {currentMission?.status?.toUpperCase() || "UNKNOWN"}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevMission}
                    className="group p-2 border border-amber-500/30 bg-black/80 hover:bg-amber-900/20 transition-all duration-300 clip-path-nav-button"
                  >
                    <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                  </button>
                  <button
                    onClick={handleNextMission}
                    className="group p-2 border border-amber-500/30 bg-black/80 hover:bg-amber-900/20 transition-all duration-300 clip-path-nav-button"
                  >
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* File Content */}
            <div ref={scrollContainerRef} className="p-4 sm:p-6 h-full overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Media Section */}
                <div className="space-y-4">

                  {/* Image Display */}
                  {currentMission?.imageUrl && (
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-3">
                        <Image className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 font-mono text-sm font-bold">MISSION OVERVIEW</span>
                      </div>
                      <div 
                        className="relative w-full h-48 sm:h-64 bg-black border border-amber-500/40 overflow-hidden"
                        style={{ 
                          boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
                          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                        }}
                      >
                        <img
                          src={currentMission?.imageUrl}
                          alt={currentMission?.title || "Mission Image"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 border border-amber-400/20 pointer-events-none"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 font-mono text-sm font-bold">MISSION DETAILS</span>
                  </div>
                  
                  <div 
                    className="bg-amber-950/10 border border-amber-500/20 p-4 sm:p-6"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                  >
                    <p className="text-amber-300/80 font-mono text-sm leading-relaxed">
                      {currentMission?.description || "No description available"}
                    </p>
                  </div>

                  {/* Mission Metadata */}
                  <div 
                    className="bg-amber-950/5 border border-amber-500/15 p-4"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                  >
                    <div className="space-y-2 text-amber-300/60 font-mono text-xs">
                      <div className="flex justify-between">
                        <span>Mission ID:</span>
                        <span className="text-amber-400">{currentMission?.id?.toUpperCase() || "UNKNOWN"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Build Type:</span>
                        <span className="text-amber-400">{currentMission?.buildType || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={getStatusColor(currentMission?.status || 'unknown').split(' ')[0]}>
                          {currentMission?.status?.toUpperCase() || "UNKNOWN"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Classification:</span>
                        <span className="text-red-400">TOP SECRET</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/40 animate-pulse"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionFilesOverlay;