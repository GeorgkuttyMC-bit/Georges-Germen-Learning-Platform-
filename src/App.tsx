import React, { useState } from 'react';
import LearnTab from './components/LearnTab';
import ConversationTab from './components/ConversationTab';
import ProgressTab from './components/ProgressTab';
import { BookOpen, MessageCircle, TrendingUp, Languages, Lightbulb } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'conversation' | 'progress'>('learn');

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#2b2b2b] selection:bg-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#f0eadd] sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 space-y-4 md:space-y-0">
            
            <div className="flex justify-between items-center w-full md:w-auto">
              <div className="flex items-center gap-3 text-orange-700">
                <div className="bg-orange-50 p-2.5 rounded-2xl shadow-sm border border-orange-100">
                  <Languages className="w-6 h-6 text-orange-600" />
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

          <nav className="flex overflow-x-auto hide-scrollbar gap-2 pb-0 font-medium text-sm md:text-base border-t border-[#f0eadd] pt-2 md:border-t-0 md:pt-0" style={{WebkitOverflowScrolling: 'touch'}}>
            {[
              { id: 'learn', label: 'Learn & Explore', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'conversation', label: 'Tutor Chat', icon: <MessageCircle className="w-4 h-4" /> },
              { id: 'progress', label: 'My Journey', icon: <TrendingUp className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'learn' | 'conversation' | 'progress')}
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
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {activeTab === 'learn' && <LearnTab />}
        {activeTab === 'conversation' && <ConversationTab />}
        {activeTab === 'progress' && <ProgressTab />}
      </main>
    </div>
  );
}
