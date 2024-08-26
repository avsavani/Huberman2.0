import React from 'react';
import { motion } from 'framer-motion';
import { usePassageItem } from './PassageItemContext';

export const Conversation: React.FC = () => {
  const { chapter } = usePassageItem();
  const podcastTitle = chapter.video_title.split('|')[0].trim();

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 text-sm text-muted-foreground overflow-hidden"
    >
      {chapter.conversation.map((segment, i) => (
        <React.Fragment key={i}>
          <strong>{segment.speaker === "SPEAKER_01" ? podcastTitle.split(':')[0] : "Dr. Huberman"}</strong>: {segment.segment} <br /><br />
        </React.Fragment>
      ))}
    </motion.div>
  );
};