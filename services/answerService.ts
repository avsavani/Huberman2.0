import { searchChapters, fetchAnswer } from './apiService';
import { formatChapter } from "@/utils";
import { handleStream } from "@/streams/streams"; // Ensure this is properly modularized too

export const handleAnswer = async (
  apiKey: string, 
  query: string, 
  matchCount: number, 
  setAnswer: React.Dispatch<React.SetStateAction<string>>, 
  setStreamComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setChapters: React.Dispatch<React.SetStateAction<any[]>> // Adjust type as necessary
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
    
    const prompt = `QUERY:"${query}" \n\n Use the following passages to provide an answer to the query: ${results?.map(formatChapter).join('\n\n')}`;
    const stream = await fetchAnswer(apiKey, prompt);
    if (stream) {
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");

      reader.read().then((result) => handleStream(result, reader, decoder, setAnswer, setStreamComplete));
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching the answer.');
  } finally {
    setLoading(false);
  }
};