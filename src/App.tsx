import React, { useState, useEffect } from 'react';
import TeacherTab from './components/TeacherTab';
import LearnTab from './components/LearnTab';
import ProgressTab from './components/ProgressTab';
import ChatPopup from './components/ChatPopup';
import { BookOpen, TrendingUp, Lightbulb, GraduationCap, MessageCircle, ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'teacher' | 'learn' | 'progress'>('teacher');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#2b2b2b] selection:bg-orange-100">
      {/* Header Top & Welcome */}
      <header className="bg-white/80 backdrop-blur-md pt-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            
            <div className="flex justify-between items-center w-full md:w-auto">
              <div className="flex items-center gap-3 text-orange-700">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center bg-white">
                  <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
                    <rect width="5" height="3" y="0" fill="#000000" />
                    <rect width="5" height="2" y="1" fill="#DD0000" />
                    <rect width="5" height="1" y="2" fill="#FFCE00" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-2xl tracking-tight leading-none text-gray-900">Georges German</span>
                  <span className="text-xs uppercase tracking-widest text-orange-600 font-bold mt-1">Learning Platform</span>
                </div>
              </div>
            </div>
            
            <a
              href="https://wa.me/9496012521?text=Hi%20George!%20I%20have%20a%20suggestion%20to%20upgrade%20the%20website... "
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center md:justify-start gap-2 px-5 py-2.5 rounded-full font-medium transition bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:text-green-800 text-sm shadow-sm group w-full md:w-auto"
            >
              <Lightbulb className="w-4 h-4 group-hover:text-yellow-500 transition-colors" />
              <span>Suggestions for George</span>
            </a>
          </div>

          <div className="mb-8 bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#f0eadd]">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Willkommen! Your German Journey Starts Here</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl">
              Mastering a new language is an adventure. We have structured this platform into four specialized tools to guide you from learning your first letters to holding fluent conversations. Here is how to navigate your learning path:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Teacher</h3>
                <p className="text-sm text-gray-600">Start here. Learn the absolute basics step-by-step, including the alphabet, numbers, and your first essential phrases.</p>
              </div>
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Learn & Explore</h3>
                <p className="text-sm text-gray-600">Deepen your knowledge. Generate custom lessons, reading materials, and grammar explanations on any topic you choose.</p>
              </div>
              <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100/50">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Tutor Chat Popup</h3>
                <p className="text-sm text-gray-600">Practice makes perfect. Click the floating chat button on the bottom right to talk to our AI tutor anytime.</p>
              </div>
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100/50">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">4. My Journey</h3>
                <p className="text-sm text-gray-600">Track your progress. Test your vocabulary, review your recent chat history, and monitor your overall learning statistics.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#f0eadd] sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex overflow-x-auto hide-scrollbar gap-2 pb-0 font-medium text-sm md:text-base pt-2" style={{WebkitOverflowScrolling: 'touch'}}>
            {[
              { id: 'teacher', label: 'Teacher', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'learn', label: 'Learn & Explore', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'progress', label: 'My Journey', icon: <TrendingUp className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'teacher' | 'learn' | 'progress')}
                className={`flex items-center gap-2 px-5 py-3 transition whitespace-nowrap border-b-[3px] md:-mb-px ${
                  activeTab === tab.id 
                    ? 'border-orange-500 text-orange-700 bg-orange-50/50 rounded-t-xl' 
                    : 'border-transparent text-[#6b6760] hover:text-[#2b2b2b] hover:bg-gray-50 rounded-t-xl'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {activeTab === 'teacher' && <TeacherTab />}
        {activeTab === 'learn' && <LearnTab />}
        {activeTab === 'progress' && <ProgressTab />}
      </main>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-24 right-6 md:top-6 md:right-6 w-16 h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50 group"
          title="Open Tutor Chat"
        >
          <MessageCircle className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-14 h-14 bg-white text-orange-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:bg-orange-50 border border-orange-100 z-40 hover:scale-105"
            title="Scroll to Top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatPopup onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
