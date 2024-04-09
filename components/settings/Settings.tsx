'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mode-select">Mode</Label>
                <Select value={mode} onValueChange={setMode} defaultValue="chat">
                  <SelectTrigger id="mode-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="match-count">Results Count</Label>
                <Input
                  id="match-count"
                  type="number"
                  min={1}
                  max={10}
                  value={matchCount.toString()}
                  onChange={(e) => setMatchCount(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClear} variant="destructive">Clear</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

