'use client';

import React from 'react';
import { IconThumbUpFilled, IconThumbDownFilled, IconClipboard } from '@tabler/icons-react';

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
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
      <div className="flex justify-between">
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