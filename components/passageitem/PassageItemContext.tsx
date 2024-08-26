import React, { createContext, useContext, useState, useEffect } from 'react';
import { HLChapter } from '@/types';

interface PassageItemContextType {
  chapter: HLChapter;
  isExpanded: boolean;
  isVideoPlaying: boolean;
  isVideoFullWidth: boolean;
  toggleExpand: () => void;
  toggleVideo: (e: React.MouseEvent) => void;
  closeVideo: (e?: React.MouseEvent) => void;
}

const PassageItemContext = createContext<PassageItemContextType | undefined>(undefined);

export const usePassageItem = () => {
  const context = useContext(PassageItemContext);
  if (!context) {
    throw new Error('usePassageItem must be used within a PassageItemProvider');
  }
  return context;
};

export const PassageItemProvider: React.FC<{ children: React.ReactNode; chapter: HLChapter }> = ({ children, chapter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoFullWidth, setIsVideoFullWidth] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoPlaying(!isVideoPlaying);
    setIsVideoFullWidth(!isVideoFullWidth);
  };

  const closeVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsVideoPlaying(false);
    setIsVideoFullWidth(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (isVideoPlaying || isVideoFullWidth)) {
        closeVideo();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isVideoPlaying, isVideoFullWidth]);

  return (
    <PassageItemContext.Provider value={{
      chapter,
      isExpanded,
      isVideoPlaying,
      isVideoFullWidth,
      toggleExpand,
      toggleVideo,
      closeVideo,
    }}>
      {children}
    </PassageItemContext.Provider>
  );
};
