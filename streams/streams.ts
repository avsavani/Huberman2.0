import { ReadableStreamDefaultReadResult, ReadableStreamDefaultReader } from "node:stream/web";

export const handleStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setStreamComplete: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> => {
  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream completed.");
        setStreamComplete(true);
        break;
      }
      
      if (value) {
        const decodedValue = decoder.decode(value, { stream: true });
        console.log("Received chunk:", decodedValue);
        setAnswer(prevAnswer => prevAnswer + decodedValue);
      }
    }
  } catch (error) {
    console.error("Error reading stream:", error);
    setStreamComplete(true);
  } finally {
    reader.releaseLock();
  }
};