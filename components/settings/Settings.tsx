'use client';

import React from 'react';

interface SettingsModalProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  mode: 'search' | 'chat';
  setMode: (mode: 'search' | 'chat') => void;
  matchCount: number;
  setMatchCount: (count: number) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  handleSave: () => void;
  handleClear: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  showSettings,
  setShowSettings,
  mode,
  setMode,
  matchCount,
  setMatchCount,
  apiKey,
  setApiKey,
  handleSave,
  handleClear,
}) => {
  // Debugging: Check if the component is being rendered
  console.log("SettingsModal rendering, showSettings:", showSettings);

  if (!showSettings) return null;

  return (
    <div className="settings-container p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="setting">
        <label htmlFor="mode-select" className="block mb-2">Mode:</label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value as "search" | "chat")}
          className="border rounded p-2 w-full mb-4"
        >
          <option value="search">Search</option>
          <option value="chat">Chat</option>
        </select>
      </div>
      <div className="setting">
        <label htmlFor="match-count" className="block mb-2">Results Count:</label>
        <input
          id="match-count"
          type="number"
          min={1}
          max={10}
          value={matchCount}
          onChange={(e) => setMatchCount(Number(e.target.value))}
          className="border rounded p-2 w-full mb-4"
        />
      </div>
      <div className="setting">
        <label htmlFor="api-key" className="block mb-2">API Key:</label>
        <input
          id="api-key"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
        <button
          onClick={handleClear}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};