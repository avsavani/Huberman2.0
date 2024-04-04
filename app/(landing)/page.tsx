'use client';
import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import Image from 'next/image'; 
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SettingsModal } from '@/components/settings/Settings';
import { SearchBar } from '@/components/searchbar/SearchBar';
import { PassageList } from '@/components/passagelist/PassageList';
import { AnswerSection } from '@/components/answersection/AnswerSection';
import { HLChapter } from "@/types";
import { handleAnswer } from '@/services/answerService';
import { handleSearch } from '@/services/searchService';
import {loadSettings, saveSettings, clearSettings} from '@/services/settingsService';
import { storeQuery } from "@/actions/storeQuery";
import { sendFeedback } from "@/actions/feedback";

export default function Home(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [chapters, setChapters] = useState<HLChapter[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(true); // Changed to true to show settings by default
  const [mode, setMode] = useState<"search" | "chat">("chat");
  const [matchCount, setMatchCount] = useState<number>(5);
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number|null>(null);
  const [streamComplete, setStreamComplete] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (streamComplete) {
      storeQuery(query, answer).catch(console.error);
      setStreamComplete(false);
    }
  }, [streamComplete, answer, query]);

  useEffect(() => {
    const { PG_KEY, PG_MATCH_COUNT, PG_MODE } = loadSettings();

    if (PG_KEY) setApiKey(PG_KEY);
    if (PG_MATCH_COUNT) setMatchCount(parseInt(PG_MATCH_COUNT));
    if (PG_MODE) setMode(PG_MODE as "search" | "chat");

    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (apiKey.length !== 51) {
      alert("Please enter a valid API key.");
      return;
    }
    saveSettings(apiKey, matchCount, mode);
    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    clearSettings();
    setApiKey("");
    setMatchCount(1);
    setMode("search");
  };

  const onSearch = async () => {
    await handleSearch(apiKey, query, matchCount, setChapters, setAnswer, setLoading);
  };

  const onAnswer = async () => {
    await handleAnswer(apiKey, query, matchCount, setAnswer, setStreamComplete, setLoading, setChapters);
  };

  return (
    <>
      {/* <div className="flex flex-col h-screen">
        <Navbar /> */}
        <div className="flex-1 h-screen overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-[800px] flex-col items-center px-3 pt-4 sm:pt-8">
            {/* <button
                className="my-4 p-8 flex cursor-pointer items-center space-x-2 rounded-full border border-zinc-600 px-3 py-1 text-sm hover:opacity-50 "
                onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Hide" : "Show"} Settings
            </button>
            <SettingsModal
              showSettings={showSettings} 
              setShowSettings={setShowSettings} 
              mode={mode} 
              setMode={setMode} 
              matchCount={matchCount} 
              setMatchCount={setMatchCount} 
              apiKey={apiKey} 
              setApiKey={setApiKey} 
              handleSave={handleSave} 
              handleClear={handleClear} 
            /> */}
            <SearchBar 
              query={query} 
              setQuery={setQuery} 
              handleSearch={onSearch} // Use the modularized search function
              handleAnswer={onAnswer} 
              mode={mode} 
              inputRef={inputRef} 
            />
            {loading ? (
              <div>Loading...</div>
            ) : answer ? (
              <AnswerSection 
                answer={answer} 
                isCopied={isCopied} 
                setIsCopied={setIsCopied} 
                feedbackGiven={feedbackGiven} 
                handleFeedback={sendFeedback} 
                query={query} 
              />
            ) : chapters.length > 0 ? (
              <PassageList 
                chapters={chapters} 
                ChapterIndex={selectedChapterIndex} 
                handleChapterClick={setSelectedChapterIndex} 
              />
            ) : (
              <div className="my-4">No results found.</div>
            )}
          </div>
        </div>
        {/* <Footer />
      </div> */}
    </>
  );
}