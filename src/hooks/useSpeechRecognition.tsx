
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
  const hasRecognitionSupport = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize speech recognition
  useEffect(() => {
    if (!hasRecognitionSupport) return;

    let recognitionInstance: any;
    
    try {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionInstance = new SpeechRecognition();
      
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
    } catch (err) {
      console.error("Error initializing speech recognition:", err);
      setError("Failed to initialize speech recognition");
    }

    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.onresult = null;
          recognitionInstance.onend = null;
          recognitionInstance.onerror = null;
          if (isListening) {
            recognitionInstance.stop();
          }
        } catch (err) {
          console.error("Error cleaning up speech recognition:", err);
        }
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
