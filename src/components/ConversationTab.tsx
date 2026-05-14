import React, { useState, useRef, useEffect } from 'react';
import { getChatSession } from '../lib/gemini';
import { Send, Loader2, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react';
import { useProgress } from '../store/progress';
import { motion, AnimatePresence } from 'motion/react';
import { playGermanAudio } from '../lib/audio';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  isError?: boolean;
};

export default function ConversationTab() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hallo! Ich bin dein Deutschlehrer. Lass uns auf Deutsch schreiben! Wie geht es dir heute? (Hello! I am your German tutor. Let's practice in German! How are you today?)", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const { increment } = useProgress();

  useEffect(() => {
    // Initialize single chat session when component mounts
    try {
      setChatSession(getChatSession());
    } catch (err) {
      console.error("Failed to initialize chat session", err);
      setMessages([{ text: "Error: Missing GEMINI_API_KEY. Please add it to your environment variables.", sender: 'bot', isError: true }]);
    }

    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'de-DE';
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        let finalTranscriptStr = '';
        recognitionRef.current.onstart = () => {
          finalTranscriptStr = '';
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
             finalTranscriptStr += (finalTranscriptStr ? ' ' : '') + currentFinal;
          }
          const displayText = finalTranscriptStr + (interimTranscript ? ' ' + interimTranscript : '');
          if (displayText) {
            setInput(displayText.trim());
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
             alert('Microphone permission was denied. If you are using this inside a preview or iframe, please open the app in a new tab by clicking the "Open in new tab" icon at the top, or check your browser settings.');
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Request microphone permission explicitly
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e: any) {
        console.error(e);
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
           alert("Microphone permission was denied. If you are using this inside a preview or iframe, please open the app in a new tab by clicking the 'Open in new tab' icon at the top, or check your browser settings.");
        } else {
           alert("Error accessing microphone: " + e.message);
        }
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isListening]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSession || loading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    increment('conversationMessages');
    setLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { text: response.text, sender: 'bot' }]);
      // Optionally play the response automatically:
      // playGermanAudio(response.text);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: "Sorry, I had trouble responding. Please try again.", sender: 'bot', isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-[#f0eadd] overflow-hidden flex flex-col h-[75vh]">
      <div className="p-5 bg-[#fcf8f2] border-b border-[#f0eadd] text-orange-900 font-serif text-xl flex items-center justify-center gap-3">
        <Bot className="w-6 h-6 text-orange-500" />
        Deutschlehrer (German Tutor)
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fdfbf7] hide-scrollbar" style={{WebkitOverflowScrolling: 'touch'}}>
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={i}
            className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
               <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#f0eadd] flex items-center justify-center flex-shrink-0">
                 <Bot className="w-5 h-5 text-orange-500" />
               </div>
            )}
            <div className={`max-w-[80%] rounded-3xl px-6 py-4 whitespace-pre-wrap leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-orange-600 text-white rounded-br-sm' 
                : msg.isError 
                  ? 'bg-red-50 text-red-600 rounded-bl-sm border border-red-100'
                  : 'bg-white text-gray-800 rounded-bl-sm border border-[#f0eadd]'
            }`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">{msg.text}</div>
                {msg.sender === 'bot' && !msg.isError && (
                  <button 
                    onClick={() => playGermanAudio(msg.text)} 
                    className="text-orange-500 hover:text-orange-600 focus:outline-none flex-shrink-0 mt-1" 
                    title="Listen to pronunciation"
                    type="button"
                  >
                     <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            {msg.sender === 'user' && (
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-300">
                 <User className="w-5 h-5 text-gray-600" />
               </div>
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-4 justify-start">
             <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#f0eadd] flex items-center justify-center flex-shrink-0">
               <Bot className="w-5 h-5 text-orange-500" />
             </div>
             <div className="bg-white border border-[#f0eadd] shadow-sm rounded-3xl rounded-bl-sm px-6 py-5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-300 animate-bounce"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce" style={{animationDelay: '300ms'}}></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-5 bg-white border-t border-[#f0eadd] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] relative">
        <AnimatePresence>
          {isListening && (
            <motion.div 
               initial={{ opacity: 0, y: 10, x: '-50%' }}
               animate={{ opacity: 1, y: 0, x: '-50%' }}
               exit={{ opacity: 0, y: 10, x: '-50%' }}
               className="absolute bottom-full mb-3 left-1/2 text-orange-600 font-medium flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 text-sm shadow-sm"
            >
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               Zuhören... (Listening...)
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSend} className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleListening}
            className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl transition shadow-sm flex-shrink-0 border ${
              isListening 
                ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'
            }`}
            title={isListening ? "Stop listening" : "Start speaking (German)"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message in German..."}
            className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-[#fefdfb] text-base placeholder:text-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-orange-600 text-white w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl hover:bg-orange-700 transition disabled:opacity-50 shadow-sm flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
