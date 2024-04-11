import { ReadableStreamDefaultReadResult, ReadableStreamDefaultReader } from "node:stream/web";

export const handleStream = async (
  result: ReadableStreamDefaultReadResult<Uint8Array>, 
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  decoder: TextDecoder, 
  setAnswer: React.Dispatch<React.SetStateAction<string>>, 
  setStreamComplete: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> => {

  if (result.done) {
    console.log("Stream completed.");
    setStreamComplete(true);
    return;
  }
  
  if (result.value) {
    const decodedValue = decoder.decode(result.value, { stream: true });
    console.log("Received chunk:", decodedValue);
    setAnswer(prevAnswer => prevAnswer + decodedValue);
  }
  
  const nextResult = await reader.read();
  return handleStream(nextResult, reader, decoder, setAnswer, setStreamComplete); // Pass forceUpdate recursively
};