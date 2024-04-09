import { searchChapters } from './apiService';
import { HLChapter } from "@/types";

export const handleSearch = async (
  apiKey: string, 
  query: string, 
  matchCount: number
): Promise<HLChapter[]> => {
  // console log
  console.log("searchChapters query:", query);
  console.log("searchChapters matchCount:", matchCount);
  return await searchChapters(apiKey, query, matchCount);
};
