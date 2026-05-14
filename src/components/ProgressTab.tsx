import React from 'react';
import { useProgress } from '../store/progress';
import { Trophy, BookOpen, MessageCircle, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProgressTab() {
  const { progress } = useProgress();

  const stats = [
    {
      title: "Topics Explored",
      value: progress.subjectsExplored,
      icon: <BookOpen className="w-8 h-8 text-orange-500" />,
      bg: "bg-orange-50",
      border: "border-orange-100"
    },
    {
      title: "Quizzes Taken",
      value: progress.quizzesTaken,
      icon: <Trophy className="w-8 h-8 text-[#8B6E4A]" />,
      bg: "bg-[#FDF8F2]",
      border: "border-[#E8DCCB]"
    },
    {
      title: "Quizzes Passed",
      value: progress.quizzesPassed,
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      bg: "bg-yellow-50/50",
      border: "border-yellow-200/50"
    },
    {
      title: "Messages Sent",
      value: progress.conversationMessages,
      icon: <MessageCircle className="w-8 h-8 text-[#5A6D5A]" />,
      bg: "bg-[#F2F5F2]",
      border: "border-[#D1DCD1]"
    }
  ];

  const accuracy = progress.quizzesTaken > 0 
    ? Math.round((progress.quizzesPassed / progress.quizzesTaken) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-[#f0eadd] text-center">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">My Learning Journey</h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">Every step brings you closer to fluency. Keep exploring, keep chatting, and keep practicing.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            key={i}
            className={`p-6 rounded-3xl border flex flex-col items-center justify-center text-center space-y-5 ${stat.bg} ${stat.border} shadow-sm`}
          >
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-black/5">
              {stat.icon}
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2 font-serif">{stat.value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {progress.quizzesTaken > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-10 rounded-3xl shadow-lg text-center"
        >
          <div className="text-lg font-medium text-orange-100 mb-2 tracking-wide uppercase">Overall Quiz Accuracy</div>
          <div className="text-7xl font-bold font-serif my-6">{accuracy}%</div>
          <div className="mt-6 w-full bg-black/10 rounded-full h-5 overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="bg-white h-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${accuracy}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
