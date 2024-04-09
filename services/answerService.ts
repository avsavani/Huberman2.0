import { searchChapters, fetchAnswer } from './apiService';
import { formatChapter } from "@/utils";
import { handleStream } from "@/streams/streams"; // Ensure this is properly modularized too
import { HLChapter } from '@/types';

export const handleAnswer = async (
  apiKey: string, 
  query: string, 
  matchCount: number, 
  setAnswer: React.Dispatch<React.SetStateAction<string>>, 
  setStreamComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setChapters: React.Dispatch<React.SetStateAction<any[]>> // Adjust type as necessary
): Promise<void> => {

  if (!query) {
    window.alert('Please enter a query.');
    return;
  }
  console.log("handleAnswer query:", query);
  setAnswer('');
  setChapters([]);
  setLoading(true);



  console.log("searchChapters query:", query);
  console.log("searchChapters matchCount:", matchCount);

  const results = await searchChapters(apiKey, query, matchCount).catch(error => {
    console.error("Error in handleAnswer its right here:", error);
    window.alert('An error occurred while searching for chapters.');
    setLoading(false);
    return null; // Return null to indicate failure
  });

  if (!results || results.length === 0) {
    window.alert('No results found.');
    setLoading(false);
    return; // Early return if no results found or error occurred
  }

  setChapters(results);

  console.log("Here are the results:", results);
  const prompt = `QUERY:"${query}" \n\n Use the following passages to provide an answer to the query: ${results.map(formatChapter).join('\n\n')}`;

  const stream = await fetchAnswer(apiKey, prompt).catch(error => {
    console.error("Error in handleAnswer:", error);
    window.alert('An error occurred while fetching the answer.');
    setLoading(false);
    return null; // Return null to indicate failure
  });

  if (stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");

    reader.read().then((result) => handleStream(result, reader, decoder, setAnswer, setStreamComplete));
  } else {
    setLoading(false);
  }
};

