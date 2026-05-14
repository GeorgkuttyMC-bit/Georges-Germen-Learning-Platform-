import React, { useState, useRef, useEffect } from 'react';
import { getChatSession } from '../lib/gemini';
import { Send, Bot, User, Mic, MicOff, Volume2, Headphones, X } from 'lucide-react';
import { useProgress } from '../store/progress';
import { motion, AnimatePresence } from 'motion/react';
import { playGermanAudio, stopAudio } from '../lib/audio';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  isError?: boolean;
};

const LadyIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2A4.5 4.5 0 0 0 7.5 6.5C7.5 9 10 11 12 11s4.5-2 4.5-4.5A4.5 4.5 0 0 0 12 2Z" />
    <path d="M2 22a10 10 0 0 1 20 0" />
    <path d="M7.5 6.5c-3 0-5.5 2.5-5.5 5.5v2" />
    <path d="M16.5 6.5c3 0 5.5 2.5 5.5 5.5v2" />
  </svg>
);

export default function ChatPopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hallo! Ich bin deine Deutschlehrerin. Lass uns auf Deutsch schreiben oder sprechen! Wie geht es dir heute?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const finalTranscriptStrRef = useRef('');
  const continuousModeRef = useRef(false);
  const isListeningRef = useRef(false);
  const autoSendTimeoutRef = useRef<any>(null);
  const loadingRef = useRef(false);
  
  const { increment } = useProgress();

  useEffect(() => {
    continuousModeRef.current = continuousMode;
  }, [continuousMode]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const handleMessageSubmitRef = useRef<(text: string) => void>();

  useEffect(() => {
    try {
      setChatSession(getChatSession());
    } catch (err) {
      console.error("Failed to initialize chat session", err);
      setMessages([{ text: "Error: Missing GEMINI_API_KEY. Please add it to your environment variables.", sender: 'bot', isError: true }]);
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'de-DE';
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
          finalTranscriptStrRef.current = '';
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let currentFinal = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinal += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (currentFinal) {
             finalTranscriptStrRef.current += (finalTranscriptStrRef.current ? ' ' : '') + currentFinal;
          }
          const displayText = finalTranscriptStrRef.current + (interimTranscript ? ' ' + interimTranscript : '');
          if (displayText) {
            setInput(displayText.trim());

            if (continuousModeRef.current && currentFinal) {
               clearTimeout(autoSendTimeoutRef.current);
               autoSendTimeoutRef.current = setTimeout(() => {
                  if (handleMessageSubmitRef.current) {
                     handleMessageSubmitRef.current(displayText.trim());
                  }
               }, 1500);
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
             alert('Microphone permission was denied.');
             setContinuousMode(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => stopAudio();
  }, []);

  const startListening = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      console.error("Mic error:", e);
      setContinuousMode(false);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setContinuousMode(false);
    } else {
      startListening();
    }
  };

  const toggleContinuousMode = () => {
    if (continuousMode) {
      setContinuousMode(false);
      stopAudio();
      if (isListening) {
         recognitionRef.current?.stop();
         setIsListening(false);
      }
    } else {
      setContinuousMode(true);
      stopAudio();
      if (!isListening) {
         startListening();
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isListening]);

  const handleMessageSubmit = async (textToSend: string) => {
    if (!textToSend.trim() || !chatSession || loadingRef.current) return;

    if (isListeningRef.current) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    clearTimeout(autoSendTimeoutRef.current);
    finalTranscriptStrRef.current = '';

    setInput('');
    setMessages(prev => [...prev, { text: textToSend, sender: 'user' }]);
    increment('conversationMessages');
    setLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: textToSend });
      setMessages(prev => [...prev, { text: response.text, sender: 'bot' }]);
      
      if (continuousModeRef.current) {
        // Only speak the German part (usually the first paragraph before any English correction)
        const germanTextToSpeak = response.text.split(/(?:(?:^|\n)Correction:|\n\n)/i)[0].trim();
        playGermanAudio(germanTextToSpeak, () => {
           if (continuousModeRef.current) {
              startListening();
           }
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: "Sorry, I had trouble responding. Please try again.", sender: 'bot', isError: true }]);
      if (continuousModeRef.current) {
        startListening();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleMessageSubmitRef.current = handleMessageSubmit;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
       handleMessageSubmit(input.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-20 right-4 md:top-6 md:right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50"
    >
      <div className="p-4 bg-orange-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LadyIcon className="w-6 h-6" />
          <span className="font-semibold text-lg">Deutschlehrerin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleContinuousMode}
            className={`p-2 rounded-full transition-colors ${
              continuousMode ? 'bg-white text-orange-600' : 'hover:bg-orange-500 text-white'
            }`}
            title="Voice Conversation Mode"
          >
            <Headphones className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-orange-500 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
               <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                 <LadyIcon className="w-4 h-4 text-orange-500" />
               </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-orange-600 text-white rounded-tr-none' 
                : msg.isError 
                  ? 'bg-red-50 text-red-600 rounded-tl-none border border-red-100'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.text}
              {msg.sender === 'bot' && !msg.isError && (
                <button 
                  onClick={() => {
                    const germanTextToSpeak = msg.text.split(/(?:(?:^|\n)Correction:|\n\n)/i)[0].trim();
                    playGermanAudio(germanTextToSpeak);
                  }} 
                  className="block mt-2 text-orange-500 hover:text-orange-600" 
                  title="Listen to pronunciation"
                  type="button"
                >
                   <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
               <LadyIcon className="w-4 h-4 text-orange-500" />
             </div>
             <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{animationDelay: '300ms'}}></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100 relative">
        <AnimatePresence>
          {isListening && (
            <motion.div 
               initial={{ opacity: 0, y: 10, x: '-50%' }}
               animate={{ opacity: 1, y: 0, x: '-50%' }}
               exit={{ opacity: 0, y: 10, x: '-50%' }}
               className="absolute bottom-[110%] left-1/2 text-orange-600 flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 text-xs font-medium shadow-sm whitespace-nowrap"
            >
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               Listening...
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSend} className="flex gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition flex-shrink-0 ${
              isListening 
                ? 'bg-red-50 text-red-500 animate-pulse' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Message in German..."}
            className="flex-1 px-3 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none focus:bg-gray-50 border border-transparent focus:border-orange-300 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-orange-600 text-white w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-700 transition disabled:opacity-50 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
