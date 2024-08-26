import React from 'react';
import { HLChapter } from "@/types";
import { PassageItem } from "@/components/passageitem/PassageItem";

interface PassageListProps {
  chapters: HLChapter[];
}

export const PassageList: React.FC<PassageListProps> = ({ chapters }) => {
  return (
    <div className="mt-6 mb-16 w-full">
      <div className="font-bold text-2xl mb-4">Passages</div>
      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <PassageItem key={chapter.video_id + chapter.start_time} chapter={chapter} index={index} />
        ))}
      </div>
    </div>
  );
};