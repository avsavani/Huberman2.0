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
  setChapters: React.Dispatch<React.SetStateAction<any[]>>, // Adjust type as necessary
  // Add forceUpdate as a parameter
  forceUpdate: () => void, // Adjust type as necessar
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
  console.log()
  console.log("Here are the results:", results);
  const prompt = `QUERY:"${query}" \n\n Use the following passages to provide an answer to the query: ${results.map(formatChapter).join('\n\n')}`;

  const stream = await fetchAnswer(apiKey, prompt).catch(error => {
    console.log("Error in handleAnswer:", error);
    window.alert('An error occurred while fetching the answer.');
    setLoading(false);
    return null; // Return null to indicate failure
  });

  // Adjust the stream processing part with error handling
  if (stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    
    // Wrap the reading in an immediately invoked async function to use await
    (async () => {
      try {
        const result = await reader.read();
        await handleStream(result, reader, decoder, setAnswer, setStreamComplete);
      } catch (error) {
        console.error("Error processing stream:", error);
        window.alert('An error occurred while processing the stream.');
      } finally {
        setLoading(false); // This will now correctly wait for handleStream to finish
      }
    })();
  } else {
    setLoading(false);
  }
};

