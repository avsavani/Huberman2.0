import React, { useState } from 'react';
import { HLChapter, HLSegment } from "@/types";
import Image from 'next/image';
import { IconExternalLink } from "@tabler/icons-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <div className="mt-6 mb-16">
      <div className="font-bold text-2xl">Passages</div>
      {chapters.map((chapter, index) => (
        <Card key={index} className="mt-4 border border-zinc-600 rounded-lg p-1 cursor-pointer transition-all duration-500">

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`chapter-${index}`}>
              <AccordionTrigger>
              <CardHeader className="flex justify-between items-left flex-grow">
            <div className="flex">
              <a href={`https://www.youtube.com/watch?v=${chapter.video_id}&t=${Math.round(parseFloat(chapter.start_time))}s`}
                 target="_blank" rel="noreferrer">
                <Image src={`https://i.ytimg.com/vi/${chapter.video_id}/hqdefault.jpg`} 
                       alt="Video thumbnail" width={128} height={72} className="object-cover rounded-lg mr-4" />
              </a>
              <CardTitle className='px-3'>{chapter.chapter_title}</CardTitle>
              <div className='flex-grow flex justify-end'>
                <a className="hover:opacity-50"
                href={`https://www.youtube.com/watch?v=${chapter.video_id}&t=${Math.round(parseFloat(chapter.start_time))}s`}
                target="_blank" rel="noreferrer">
                <IconExternalLink />
                </a>
              </div>
            </div>
          </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                {formatChapterUI(chapter, chapter.video_title.split(':')[0].split('：')[0])}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      ))}
    </div>
  );
};  