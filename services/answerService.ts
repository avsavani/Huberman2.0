import { searchChapters } from './apiService';
import { formatChapter } from "@/utils";

export const handleAnswer = async (
  query: string,
  setAnswer: React.Dispatch<React.SetStateAction<string>>, 
  setStreamComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setChapters: React.Dispatch<React.SetStateAction<any[]>>,
): Promise<void> => {
  if (!query) {
    window.alert('Please enter a query.');
    return;
  }
  console.log("handleAnswer query:", query);
  setAnswer('');
  setChapters([]);
  setLoading(true);

  try {
    const response = await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log("Stream complete");
            setStreamComplete(true);
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          setAnswer(prev => prev + chunk);
        }
      } catch (error) {
        console.error("Error processing stream:", error);
        window.alert('An error occurred while processing the stream.');
      } finally {
        setLoading(false);
      }
    } else {
      throw new Error('Failed to get reader from response');
    }
  } catch (error) {
    console.error("Error in handleAnswer:", error);
    window.alert('An error occurred while fetching the answer.');
    setLoading(false);
  }
};

