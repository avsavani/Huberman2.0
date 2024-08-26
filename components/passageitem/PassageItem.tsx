'use client';
import React, { useRef } from 'react';
import { HLChapter } from '@/types';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useInView } from 'framer-motion';
import { PassageItemProvider } from './PassageItemContext';
import { PassageItemContent } from './PassageItemContent';

interface PassageItemProps {
  chapter: HLChapter;
  index: number;
}

export const PassageItem: React.FC<PassageItemProps> = ({ chapter, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <PassageItemProvider chapter={chapter}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        whileHover={{ scale: 1.05 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.25, delay: index * 0.005 }}
      >
        <Card>
          <PassageItemContent />
        </Card>
      </motion.div>
    </PassageItemProvider>
  );
};