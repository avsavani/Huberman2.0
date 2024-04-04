import { ReadableStreamDefaultReadResult, ReadableStreamDefaultReader } from "node:stream/web";

export const handleStream = async (
  result: ReadableStreamDefaultReadResult<Uint8Array>, 
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  decoder: TextDecoder, 
  setAnswer: React.Dispatch<React.SetStateAction<string>>, 
  setStreamComplete: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  if (result.done) {
    setStreamComplete(true);
    return;
  }

  if (result.value) {
    const decodedValue = decoder.decode(result.value, { stream: true });
    setAnswer((prevAnswer) => prevAnswer + decodedValue);
  }

  const nextResult = await reader.read();
  handleStream(nextResult, reader, decoder, setAnswer, setStreamComplete);
};