'use client';
import React from 'react';
import { PassageItem } from '@/components/passageitem/PassageItem';
import { HLChapter } from '@/types';

interface PassageListProps {
  chapters: HLChapter[];
  ChapterIndex: number | null;
  handleChapterClick: (index: number) => void;
}

export const PassageList: React.FC<PassageListProps> = ({
  chapters,
  ChapterIndex,
  handleChapterClick,
}) => {
  return (
    <div className="mt-6 w-full">
      {chapters.map((chapter, index) => (
        <PassageItem
          key={index}
          chapter={chapter}
          index={index}
          isSelected={ChapterIndex === index}
          onClick={() => handleChapterClick(index)}
        />
      ))}
    </div>
  );
};
  