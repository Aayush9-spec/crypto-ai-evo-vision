
import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
  error?: string;
}

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [recognition, setRecognition] = useState<any | null>(null);

  // Check if browser supports speech recognition
  const hasRecognitionSupport = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  useEffect(() => {
    if (!hasRecognitionSupport) return;

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      setIsListening(false);
    };

    recognitionInstance.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
      }
    };
  }, [hasRecognitionSupport]);

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    setTranscript('');
    setError(undefined);
    setIsListening(true);
    
    try {
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start listening');
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
  }, [recognition]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error
  };
};

export default useSpeechRecognition;
