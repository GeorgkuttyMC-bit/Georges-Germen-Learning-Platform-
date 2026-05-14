import React, { useState } from 'react';
import { generateLearningMaterial } from '../lib/gemini';
import { playGermanAudio, stopAudio } from '../lib/audio';
import { Volume2, VolumeX, Loader2, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useProgress } from '../store/progress';
import { motion } from 'motion/react';

type Material = {
  explanation: string;
  essay: string;
  essayTranslation: string;
  grammarConcept: {
    concept: string;
    explanation: string;
    examples: { german: string; english: string }[];
  };
  vocabulary: { word: string; translation: string }[];
  quizzes: { question: string; options: string[]; correctOptionIndex: number }[];
};

export default function LearnTab() {
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState<Material | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  
  const { increment } = useProgress();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    
    setLoading(true);
    setMaterial(null);
    setQuizAnswers({});
    setShowResults(false);
    stopAudio();
    setIsPlaying(false);

    try {
      const data = await generateLearningMaterial(subject);
      setMaterial(data as Material);
      increment('subjectsExplored');
    } catch (error: any) {
      console.error("Failed to generate material:", error);
      alert(`Failed to generate learning material: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else if (material) {
      playGermanAudio(material.essay);
      setIsPlaying(true);
    }
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
    let correct = 0;
    material?.quizzes.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctOptionIndex) correct++;
    });
    
    increment('quizzesTaken', material?.quizzes.length || 0);
    increment('quizzesPassed', correct);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0eadd]">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <div className="bg-orange-50 p-2 text-orange-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          What would you like to learn about?
        </h2>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Oktoberfest, German Cars, The Black Forest..."
            className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-[#fefdfb] text-lg text-gray-900 placeholder:text-gray-400"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Lesson'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-3">Or choose a suggested topic:</p>
          <div className="flex flex-wrap gap-2">
            {['Oktoberfest in Munich', 'The Black Forest', 'German Engineering', 'The Berlin Wall', 'Currywurst and Food Culture'].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSubject(topic)}
                disabled={loading}
                className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100 rounded-full text-sm font-medium transition disabled:opacity-50"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 text-[#8b8780] space-y-6">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          <p className="text-xl font-medium tracking-wide">Crafting your personalized German lesson...</p>
        </div>
      )}

      {!material && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 space-y-12"
        >
          {/* Introduction Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h3 className="font-serif text-3xl font-bold text-gray-900">Why Learn German?</h3>
              <p className="text-gray-600 text-lg">
                Discover the endless possibilities that come with mastering the German language. From world-class education to thriving career opportunities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0eadd]">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <h4 className="font-serif text-xl font-semibold text-gray-900 mb-3">World-Class Education</h4>
                <p className="text-gray-600 leading-relaxed">
                  Germany is renowned for its high-quality education system. Most public universities offer tuition-free study programs for international students, with degrees recognized globally. Learning German opens doors to thousands of academic programs in engineering, science, arts, and humanities.
                </p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0eadd]">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                </div>
                <h4 className="font-serif text-xl font-semibold text-gray-900 mb-3">Global Career Opportunities</h4>
                <p className="text-gray-600 leading-relaxed">
                  Germany boasts the largest economy in Europe and the third-largest globally. It's home to major international corporations like Volkswagen, Siemens, and BMW. Proficiency in German gives you a competitive edge in international business and STEM fields, both in Europe and worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-gray-900">Discover Germany</h3>
              <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Inspiration</span>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative rounded-3xl overflow-hidden aspect-video shadow-sm border border-gray-100">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Schloss_Neuschwanstein_2013.jpg/1024px-Schloss_Neuschwanstein_2013.jpg" 
                alt="Neuschwanstein Castle"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-white font-serif text-xl font-bold mb-1">Neuschwanstein Castle</h4>
                <p className="text-white/80 text-sm">Bavaria</p>
              </div>
            </div>
            
            <div className="group relative rounded-3xl overflow-hidden aspect-video shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2670&auto=format&fit=crop" 
                alt="Brandenburg Gate"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-white font-serif text-xl font-bold mb-1">Brandenburg Gate</h4>
                <p className="text-white/80 text-sm">Berlin</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-black aspect-video relative">
             <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/n21uF3b6lYc?autoplay=1&mute=1&loop=1&playlist=n21uF3b6lYc&controls=0&showinfo=0&rel=0&modestbranding=1" 
                title="Germany Cinematic Aerial" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 pointer-events-none"
                style={{ transform: 'scale(1.2)' }}
             ></iframe>
             <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 p-6 md:p-8 pointer-events-none">
                <h4 className="text-white font-serif text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">Beautiful Landscapes</h4>
                <p className="text-white/90 text-sm md:text-base drop-shadow-md max-w-lg">Get inspired by the diverse and beautiful landscapes, from the Alpine peaks to the bustling cities of Germany.</p>
             </div>
          </div>
          </div>
        </motion.div>
      )}

      {material && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Explanation */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0eadd]">
            <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Background Explanation</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{material.explanation}</p>
          </div>

          {/* Essay & Audio */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0eadd]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h3 className="font-serif text-2xl font-semibold text-gray-900">German Story / Essay</h3>
              <button
                onClick={toggleAudio}
                className={`flex justify-center items-center gap-2 px-5 py-2.5 rounded-full font-medium transition w-full sm:w-auto ${isPlaying ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100'}`}
              >
                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                {isPlaying ? 'Stop Audio' : 'Listen in German'}
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">German</h4>
                <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">{material.essay}</p>
              </div>
              <div className="md:border-l md:border-gray-100 md:pl-12">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">English Translation</h4>
                <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-wrap italic">{material.essayTranslation}</p>
              </div>
            </div>
          </div>

          {/* Grammar Concept */}
          {material.grammarConcept && (
            <div className="bg-[#f0f4f8] p-6 md:p-8 rounded-3xl shadow-sm border border-blue-100">
              <h3 className="font-serif text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Grammar Focus: {material.grammarConcept.concept}
              </h3>
              <p className="text-blue-800 leading-relaxed text-lg mb-6">{material.grammarConcept.explanation}</p>
              <div className="space-y-4">
                 {material.grammarConcept.examples.map((ex, i) => (
                   <div key={i} className="bg-white p-4 rounded-2xl border border-blue-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-medium text-gray-900 text-lg">{ex.german}</div>
                      <div className="text-gray-500 italic sm:border-l sm:border-gray-200 sm:pl-4">{ex.english}</div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* Vocabulary */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0eadd]">
            <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Key Vocabulary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {material.vocabulary.map((v, i) => (
                <div key={i} className="bg-[#fcf8f2] p-5 rounded-2xl border border-orange-100/50 group hover:border-orange-200 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-bold text-gray-900 text-xl leading-tight font-serif">{v.word}</div>
                    <button
                      onClick={() => playGermanAudio(v.word)}
                      className="p-2 rounded-full bg-orange-50 shadow-sm border border-orange-100 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition flex-shrink-0 focus:ring-2 focus:ring-orange-500/50"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-gray-600 font-medium">{v.translation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quizzes */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0eadd]">
            <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-8">Knowledge Check</h3>
            <div className="space-y-10 mb-10">
              {material.quizzes.map((quiz, quizIdx) => (
                <div key={quizIdx} className="space-y-5">
                  <p className="font-semibold text-xl text-gray-900 font-serif">{quizIdx + 1}. {quiz.question}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {quiz.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[quizIdx] === optIdx;
                      const isCorrect = showResults && optIdx === quiz.correctOptionIndex;
                      const isWrong = showResults && isSelected && optIdx !== quiz.correctOptionIndex;
                      
                      let btnClass = "text-left px-6 py-4 rounded-2xl border-2 transition "
                      if (isCorrect) {
                        btnClass += "border-green-500 bg-green-50 text-green-800 font-semibold";
                      } else if (isWrong) {
                        btnClass += "border-red-500 bg-red-50 text-red-800 font-semibold";
                      } else if (isSelected) {
                        btnClass += "border-orange-500 bg-orange-50 text-orange-800 font-semibold";
                      } else {
                        btnClass += "border-gray-200 hover:border-orange-300 hover:bg-[#fcf8f2] text-gray-700 bg-white";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={showResults}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [quizIdx]: optIdx }))}
                          className={btnClass}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="leading-snug">{opt}</span>
                            {isCorrect && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />}
                            {isWrong && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {!showResults && Object.keys(quizAnswers).length === material.quizzes.length && (
              <button
                onClick={handleQuizSubmit}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 transition shadow-sm"
              >
                Submit Answers
              </button>
            )}
            
            {showResults && (
              <div className="p-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl font-semibold text-center text-xl flex items-center justify-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                You got {material.quizzes.filter((q, i) => quizAnswers[i] === q.correctOptionIndex).length} out of {material.quizzes.length} correct!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
