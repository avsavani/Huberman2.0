'use client';
import React from 'react';
import { HLChapter } from '@/types';

interface PassageItemProps {
  chapter: HLChapter;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export const PassageItem: React.FC<PassageItemProps> = ({
  chapter,
  index,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`p-4 mb-4 border rounded-md hover:bg-gray-100 cursor-pointer ${
        isSelected ? 'bg-blue-100' : ''
      }`}
      onClick={onClick}
    >
      <div className="font-bold text-xl mb-2">Passage {index + 1}</div>
      <div
        className="text-gray-700"
        dangerouslySetInnerHTML={{ __html: chapter.conversation }}
      />
    </div>
  );
};