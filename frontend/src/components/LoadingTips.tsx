import React, { useEffect, useState } from 'react';
import { Brain, FileText, Zap, Sparkles, BookOpen, Target } from 'lucide-react';

interface LoadingTipsProps {
  isLoading: boolean;
}

const LoadingTips: React.FC<LoadingTipsProps> = ({ isLoading }) => {
  const tips = [
    { icon: FileText, text: "🎬 Fetching transcript from YouTube..." },
    { icon: Brain, text: "🧠 Analyzing key concepts with AI..." },
    { icon: BookOpen, text: "📝 Generating comprehensive summary..." },
    { icon: Target, text: "🎯 Creating quiz questions..." },
    { icon: Sparkles, text: "✨ Organizing flashcards for you..." },
    { icon: Zap, text: "💡 Did you know? Spaced repetition helps you remember 80% more." },
    { icon: Brain, text: "🔍 Extracting important details from video..." },
    { icon: FileText, text: "📊 Breaking down content into digestible chunks..." },
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 2500); // Change tip every 2.5 seconds

    return () => clearInterval(interval);
  }, [isLoading, tips.length]);

  if (!isLoading) return null;

  const CurrentIcon = tips[currentTipIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-600/20 rounded-full animate-ping"></div>
        <div className="relative h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
          <CurrentIcon className="text-white animate-pulse" size={32} />
        </div>
      </div>

      {/* Loading Tip Text */}
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-center max-w-md transition-all duration-500 animate-fadeIn">
        {tips[currentTipIndex].text}
      </p>

      {/* Progress Dots */}
      <div className="flex gap-2">
        {tips.map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentTipIndex
                ? 'w-8 bg-indigo-600'
                : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
          ></span>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingTips;
