import React from 'react';
import { cn } from "@/lib/utils";
import { usePassageItem } from './PassageItemContext';

export const ChapterInfo: React.FC = () => {
  const { chapter, isVideoFullWidth } = usePassageItem();
  const podcastTitle = chapter.video_title.split('|')[0].trim();

  return (
    <div className={cn(
      "space-y-1",
      isVideoFullWidth ? "mt-4" : "flex-1 ml-4 w-1/2"
    )}>
      <h3 className="text-lg font-semibold line-clamp-2">{chapter.chapter_title}</h3>
      <p className="text-sm text-muted-foreground">{podcastTitle.split(':')[0]}</p>
    </div>
  );
};