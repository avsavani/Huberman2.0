import React, { useState } from 'react';
import { HLChapter, HLSegment } from "@/types";
import Image from 'next/image';
import { IconExternalLink } from "@tabler/icons-react";

interface PassageListProps {
  chapters: HLChapter[];
}

const formatSegment = (segment: HLSegment, index: number, speaker: string) => (
  <React.Fragment key={index}>
    <strong>{segment.speaker === "SPEAKER_01" ? speaker : "Dr. Huberman"}</strong>: {segment.segment} <br /><br />
  </React.Fragment>
);

const formatChapterUI = (chapter: HLChapter, speaker: string) => (
  <>
    {chapter.conversation.map((segment, i) => formatSegment(segment, i, speaker))}
  </>
);

export const PassageList: React.FC<PassageListProps> = ({ chapters }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);

  const handleChapterClick = (index: number) => {
    setSelectedChapterIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <div className="mt-6 mb-16">
      <div className="font-bold text-2xl">Passages</div>
      {chapters.map((chapter, index) => (
        <div
          key={index}
          className={`mt-4 border border-zinc-600 rounded-lg p-4 cursor-pointer transition-all duration-500 ${selectedChapterIndex === index ? 'bg-blue-100' : ''}`}
          onClick={() => handleChapterClick(index)}
        >
          <div className="flex justify-between">
            <div className="flex items-start">
              <a href={`https://www.youtube.com/watch?v=${chapter.video_id}&t=${Math.round(parseFloat(chapter.start_time))}s`}
                 target="_blank" rel="noreferrer">
                <Image src={`https://i.ytimg.com/vi/${chapter.video_id}/hqdefault.jpg`} 
                       alt="Video thumbnail" width={128} height={72} className="object-cover rounded-lg" />
              </a>
              <div className="ml-4">
                <div className="font-bold text-xl">{chapter.chapter_title}</div>
                <div className="mt-1 font-bold text-sm">{chapter.video_date}</div>
                <div className="mt-1 text-sm">
                  {chapter.video_title.split('|')[0].split('｜')[0]}
                </div>
              </div>
            </div>
            <a className="hover:opacity-50 ml-2"
               href={`https://www.youtube.com/watch?v=${chapter.video_id}&t=${Math.round(parseFloat(chapter.start_time))}s`}
               target="_blank" rel="noreferrer">
              <IconExternalLink />
            </a>
          </div>
          <div className={`passage-content ${selectedChapterIndex === index ? 'h-auto mt-2' : 'h-0'} overflow-hidden`}>
              {formatChapterUI(chapter, chapter.video_title.split(':')[0].split('：')[0])}
          </div>
        </div>
      ))}
    </div>
  );
};