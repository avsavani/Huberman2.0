import { searchChapters } from './apiService';
import { HLChapter } from "@/types";

export const handleSearch = async (
  apiKey: string, 
  query: string, 
  matchCount: number, 
  setChapters: React.Dispatch<React.SetStateAction<HLChapter[]>>, 
  setAnswer: React.Dispatch<React.SetStateAction<string>>, 
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  if (!apiKey || !query) {
    alert(!apiKey ? 'Please enter an API key.' : 'Please enter a query.');
    return;
  }
  setAnswer('');
  setChapters([]);
  setLoading(true);
  try {
    const results = await searchChapters(apiKey, query, matchCount);
    setChapters(results);
  } catch (error) {
    console.error(error);
    alert('An error occurred while performing the search.');
  } finally {
    setLoading(false);
  }
};