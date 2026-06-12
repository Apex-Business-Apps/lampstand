import { useState, useEffect, useRef, useCallback } from 'react';

export function useLocalSTT() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  
  const audioChunksRef = useRef<Float32Array[]>([]);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(new URL('../workers/whisper.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (e) => {
      const { type, status, data, text, error: errMsg } = e.data;
      if (type === 'STATUS') {
        if (status === 'downloading') setIsDownloading(true);
        if (status === 'ready') {
          setIsDownloading(false);
          setIsReady(true);
          setIsProcessing(false);
        }
        if (status === 'processing') setIsProcessing(true);
      } else if (type === 'PROGRESS') {
        // can handle progress
      } else if (type === 'RESULT') {
        setTranscript(text);
        setIsProcessing(false);
      } else if (type === 'ERROR') {
        setError(errMsg);
        setIsProcessing(false);
        setIsDownloading(false);
      }
    };

    workerRef.current.postMessage({ type: 'INIT' });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscript('');
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = source;
      
      // Using ScriptProcessor for compatibility and simplicity.
      // 4096 buffer size
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // We must copy the array because the buffer is reused
        audioChunksRef.current.push(new Float32Array(inputData));
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      setIsRecording(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not start recording');
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    
    // Stop recording
    processorNodeRef.current?.disconnect();
    sourceNodeRef.current?.disconnect();
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    
    processorNodeRef.current = null;
    sourceNodeRef.current = null;
    mediaStreamRef.current = null;
    audioContextRef.current = null;
    
    // Concatenate chunks
    const chunks = audioChunksRef.current;
    if (chunks.length === 0) return;
    
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioData = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioData.set(chunk, offset);
      offset += chunk.length;
    }
    
    // Send to worker
    workerRef.current?.postMessage({ type: 'PROCESS_AUDIO', audio: audioData });
  };

  const clearTranscript = useCallback(() => setTranscript(''), []);

  return {
    isReady,
    isDownloading,
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording,
    clearTranscript
  };
}
