import React, { useState, useRef, useEffect } from 'react';
import { getChatSession } from '../lib/gemini';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { useProgress } from '../store/progress';
import { motion } from 'motion/react';

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
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { increment } = useProgress();

  useEffect(() => {
    // Initialize single chat session when component mounts
    try {
      setChatSession(getChatSession());
    } catch (err) {
      console.error("Failed to initialize chat session", err);
      setMessages([{ text: "Error: Missing GEMINI_API_KEY. Please add it to your environment variables.", sender: 'bot', isError: true }]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSession || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    increment('conversationMessages');
    setLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { text: response.text, sender: 'bot' }]);
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
              {msg.text}
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

      <div className="p-4 sm:p-5 bg-white border-t border-[#f0eadd] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message in German..."
            className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-[#fefdfb] text-base placeholder:text-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-orange-600 text-white w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-orange-700 transition disabled:opacity-50 shadow-sm flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
