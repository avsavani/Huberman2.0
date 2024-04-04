'use client';
import React, { KeyboardEvent, useRef } from 'react';
import { IconSearch, IconMessage2 } from '@tabler/icons-react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: () => void;
  handleAnswer: () => void;
  mode: 'search' | 'chat';
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  handleSearch,
  handleAnswer,
  mode,
  inputRef,
}) => {

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        mode === 'search' ? handleSearch() : handleAnswer();
      }
  };

  return (
    <div className="relative w-full mt-4">
      <IconSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
      <input
        ref={inputRef}
        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 pl-10 pr-12 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 sm:mt-0 sm:pl-10 sm:pr-16"
        type="text"
        placeholder="How can one improve sleep quality?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="absolute top-1/2 right-2 transform -translate-y-1/2" onClick={mode === 'search' ? handleSearch : handleAnswer}>
        <IconMessage2
          className="h-5 w-5 hover:cursor-pointer sm:h-8 sm:w-8 text-gray-500"
        />
      </button>
    </div>
  );
};