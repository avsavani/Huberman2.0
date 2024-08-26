'use client';

import React from 'react';
import { IconThumbUpFilled, IconThumbDownFilled, IconClipboard } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './AnswerSection.module.css';

interface AnswerSectionProps {
  answer: string;
  isCopied: boolean;
  setIsCopied: React.Dispatch<React.SetStateAction<boolean>>;
  feedbackGiven: boolean;
  handleFeedback: (feedback: boolean, query: string, answer: string) => void;
  query: string;
}

export const AnswerSection: React.FC<AnswerSectionProps> = ({
  answer,
  isCopied,
  setIsCopied,
  feedbackGiven,
  handleFeedback,
  query,
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`mt-6 text-left w-full px-4 sm:px-6 md:px-8 ${styles.fadeIn}`}>
      <div className="font-bold text-2xl mb-2">Answer</div> {/* Removed min-w-[650px] */}
      <div className="prose max-w-full"> {/* Added max-w-full to allow full width */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
      </div>
      <div className="flex justify-between items-center py-5">
        <div>
          {!feedbackGiven && (
            <div className="flex space-x-4">
              <button
                className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600"
                onClick={() => handleFeedback(true, query, answer)}
                aria-label="Thumbs up"
              >
                <IconThumbUpFilled />
              </button>
              <button
                className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                onClick={() => handleFeedback(false, query, answer)}
                aria-label="Thumbs down"
              >
                <IconThumbDownFilled />
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={`h-8 w-8 ${isCopied ? 'text-green-500' : 'text-blue-500'} hover:cursor-pointer`}
          aria-label="Copy"
        >
          <IconClipboard />
        </button>
      </div>
    </div>
  );
};