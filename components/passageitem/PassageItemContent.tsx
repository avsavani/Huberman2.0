import React from 'react';
import { cn } from "@/lib/utils";
import { VideoPlayer } from './VideoPlayer';
import { ChapterInfo } from './ChapterInfo';
import { Conversation } from './Conversation';
import { usePassageItem } from './PassageItemContext';

export const PassageItemContent: React.FC = () => {
  const { isExpanded, isVideoFullWidth, toggleExpand } = usePassageItem();

  return (
    <div 
      className={cn(
        "rounded-lg shadow-sm hover:shadow-md transition-all p-4",
        isExpanded && "bg-slate-50",
        "cursor-pointer"
      )}
      onClick={toggleExpand}
    >
      <div className="flex flex-col">
        <div className={cn("flex", isVideoFullWidth && "flex-col")}>
          <VideoPlayer />
          <ChapterInfo />
        </div>
      </div>
      {isExpanded && <Conversation />}
    </div>
  );
};