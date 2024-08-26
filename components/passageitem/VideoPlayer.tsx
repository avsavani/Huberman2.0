import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { usePassageItem } from './PassageItemContext';

export const VideoPlayer: React.FC = () => {
  const { 
    chapter, 
    isVideoPlaying, 
    isVideoFullWidth, 
    toggleVideo, 
    closeVideo 
  } = usePassageItem();

  return (
    <motion.div 
      className={cn(
        "video-container relative",
        isVideoFullWidth ? "w-full" : "w-1/2 flex-shrink-0",
        "transition-all duration-300"
      )}
      onClick={toggleVideo}
      layout
    >
      <motion.div
        className={cn(
          "relative",
          isVideoFullWidth ? "w-full pb-[56.25%]" : "w-full pb-[56.25%]"
        )}
        layout
      >
        <AnimatePresence initial={false} mode="wait">
          {isVideoPlaying ? (
            <motion.iframe
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={`https://www.youtube.com/embed/${chapter.video_id}?start=${Math.round(parseFloat(chapter.start_time))}&autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-md"
            />
          ) : (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <Image
                src={`https://img.youtube.com/vi/${chapter.video_id}/0.jpg`}
                alt="Chapter Thumbnail"
                fill
                className="rounded-md object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {isVideoFullWidth && isVideoPlaying && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              closeVideo();
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all"
          >
            <X size={20} />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};