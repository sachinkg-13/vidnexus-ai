import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ArrowLeft, Bell, User, Share2, Bookmark, Download, Copy, Lightbulb, FileText, CreditCard, HelpCircle, Check, X, CircleDot, Eye, Play, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTheme } from '../contexts/ThemeContext';

interface Flashcard {
  front: string;
  back: string;
}

interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

interface NoteData {
  id: number;
  youtube_url: string;
  summary: string[];
  flashcards: Flashcard[];
  quiz: QuizItem[];
}

const NoteDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [note, setNote] = useState<NoteData | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    client.get(`/notes/${id}/`)
      .then(res => setNote(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const getYouTubeVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v') || '';
    } catch {
      return '';
    }
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : 'https://via.placeholder.com/1280x720/6366f1/ffffff?text=Video';
  };

  const copyAllSummary = () => {
    if (note?.summary) {
      const text = note.summary.join('\n\n');
      navigator.clipboard.writeText(text);
      alert('Summary copied to clipboard!');
    }
  };

  const handleQuizAnswer = (questionIndex: number, option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: option });
  };

  const checkAnswer = (questionIndex: number) => {
    setRevealedAnswers({ ...revealedAnswers, [questionIndex]: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
          <p className="text-gray-600 mb-6">The note you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 md:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="text-gray-900 dark:text-white" size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="size-8 flex items-center justify-center">
                <img src="/logo.png" alt="VidNexus AI" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">VidNexus AI</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-9">
            <a onClick={() => navigate('/dashboard')} className="text-gray-900 dark:text-gray-200 text-sm font-medium hover:text-indigo-600 transition-colors cursor-pointer">Dashboard</a>
            <a className="text-indigo-600 text-sm font-bold cursor-pointer">My Notes</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center rounded-full size-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="hidden md:flex items-center justify-center rounded-full size-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Bell size={20} />
          </button>
          <button className="flex items-center justify-center rounded-full size-10 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <User size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-[1024px] mx-auto flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <a onClick={() => navigate('/')} className="text-gray-500 dark:text-gray-400 font-medium hover:text-indigo-600 transition-colors cursor-pointer">Home</a>
            <span className="text-gray-500 dark:text-gray-600 font-medium">/</span>
            <a onClick={() => navigate('/dashboard')} className="text-gray-500 dark:text-gray-400 font-medium hover:text-indigo-600 transition-colors cursor-pointer">My Notes</a>
            <span className="text-gray-500 dark:text-gray-600 font-medium">/</span>
            <span className="text-gray-900 dark:text-white font-medium">Note #{note.id}</span>
          </div>

          {/* Video Header Context Block */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="relative w-full md:w-80 aspect-video rounded-xl overflow-hidden shrink-0 group cursor-pointer">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all z-10"></div>
                <div
                  className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${getYouTubeThumbnail(note.youtube_url)}')` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3 text-white">
                    <Play size={32} />
                  </div>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    Note #{note.id}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 dark:text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      YouTube Video
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <a
                      href={note.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 transition-colors truncate max-w-xs"
                    >
                      {note.youtube_url}
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 items-center pt-2">
                  <button className="flex items-center justify-center h-10 px-5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm font-bold gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button className="flex items-center justify-center h-10 px-5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm font-bold gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Bookmark size={18} />
                    Save
                  </button>
                  <button className="flex items-center justify-center h-10 px-5 bg-indigo-600 text-white rounded-full text-sm font-bold gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all ml-auto md:ml-0">
                    <Download size={18} />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="w-full">
            <div className="inline-flex p-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('summary')}
                className={clsx(
                  'flex-1 md:flex-none px-8 py-2.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2',
                  activeTab === 'summary'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                )}
              >
                <FileText size={18} />
                Summary
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={clsx(
                  'flex-1 md:flex-none px-8 py-2.5 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2',
                  activeTab === 'flashcards'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                )}
              >
                <CreditCard size={18} />
                Flashcards
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={clsx(
                  'flex-1 md:flex-none px-8 py-2.5 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2',
                  activeTab === 'quiz'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                )}
              >
                <HelpCircle size={18} />
                Quiz
              </button>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'summary' && (
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
                  {/* Floating Copy Button */}
                  <div className="absolute top-6 right-6 md:top-10 md:right-10">
                    <button
                      onClick={copyAllSummary}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm bg-indigo-600/5 hover:bg-indigo-600/10 px-4 py-2 rounded-full transition-colors"
                    >
                      <Copy size={18} />
                      <span className="hidden sm:inline">Copy All</span>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="max-w-3xl space-y-10">
                    {/* Section */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600/10 text-indigo-600">
                          <Lightbulb size={20} />
                        </span>
                        Key Takeaways
                      </h3>
                      <ul className="space-y-4">
                        {note.summary?.map((point, index) => (
                          <li key={index} className="flex items-start gap-4">
                            <span className="mt-2.5 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-400 shrink-0 shadow-lg shadow-indigo-600/60"></span>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'flashcards' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {note.flashcards?.map((card, index) => (
                    <FlashcardItem key={index} card={card} index={index} />
                  ))}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  {note.quiz?.map((q, index) => {
                    // Helper function to check if answer is correct
                    const isAnswerCorrect = (selectedAnswer: string, correctAnswer: string, options: string[]) => {
                      // Check if correctAnswer is a letter (A, B, C, D)
                      if (correctAnswer.length === 1 && /^[A-Z]$/i.test(correctAnswer)) {
                        const correctIndex = correctAnswer.toUpperCase().charCodeAt(0) - 65;
                        return selectedAnswer === options[correctIndex];
                      }
                      // Otherwise, compare directly
                      return selectedAnswer === correctAnswer;
                    };
                    
                    const isCorrectAnswer = revealedAnswers[index] && selectedAnswers[index] 
                      ? isAnswerCorrect(selectedAnswers[index], q.answer, q.options)
                      : false;
                    
                    return (
                    <div
                      key={index}
                      className={clsx(
                        'relative bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-sm border transition-all',
                        revealedAnswers[index]
                          ? isCorrectAnswer
                            ? 'border-emerald-100 dark:border-emerald-900/30'
                            : 'border-red-100 dark:border-red-900/30'
                          : 'border-gray-100 dark:border-gray-700 hover:shadow-md'
                      )}
                    >
                      {/* Background Tint */}
                      {revealedAnswers[index] && (
                        <div className={clsx(
                          'absolute inset-0 pointer-events-none rounded-xl',
                          isCorrectAnswer
                            ? 'bg-emerald-50/50 dark:bg-emerald-900/10'
                            : 'bg-red-50/30 dark:bg-red-900/5'
                        )}></div>
                      )}

                      <div className="relative z-10">
                        <div className="mb-6">
                          <span className={clsx(
                            'inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full',
                            revealedAnswers[index]
                              ? isCorrectAnswer
                                ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                              : 'bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-sm shadow-blue-500/20'
                          )}>
                            {revealedAnswers[index] && (
                              isCorrectAnswer ? <Check size={14} /> : <X size={14} />
                            )}
                            Q{index + 1}
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          {q.question}
                        </h3>

                        <div className="flex flex-col gap-3">
                          {q.options?.map((opt, i) => {
                            const isSelected = selectedAnswers[index] === opt;
                            // Get the option letter (A, B, C, D) based on index
                            const optionLetter = String.fromCharCode(65 + i); // 65 is ASCII for 'A'
                            const isCorrect = q.answer === optionLetter || q.answer === opt;
                            const isRevealed = revealedAnswers[index];

                            return (
                              <label
                                key={i}
                                className={clsx(
                                  'relative flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all',
                                  !isRevealed && 'border hover:border-indigo-600/40 hover:bg-gray-50 dark:hover:bg-white/5',
                                  !isRevealed && isSelected && 'border-2 border-indigo-600 bg-indigo-600/5',
                                  !isRevealed && !isSelected && 'border border-gray-200 dark:border-gray-700',
                                  isRevealed && isSelected && isCorrect && 'border-2 border-emerald-500 bg-white dark:bg-gray-800 shadow-sm',
                                  isRevealed && isSelected && !isCorrect && 'border-2 border-red-500 bg-white dark:bg-gray-800 shadow-sm',
                                  isRevealed && !isSelected && isCorrect && 'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm border-dashed',
                                  isRevealed && !isSelected && !isCorrect && 'border border-transparent opacity-50'
                                )}
                              >
                                <input
                                  type="radio"
                                  name={`quiz-${index}`}
                                  value={opt}
                                  checked={isSelected}
                                  onChange={() => handleQuizAnswer(index, opt)}
                                  disabled={isRevealed}
                                  className="size-5 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                />
                                <div className="flex-1">
                                  <span className={clsx(
                                    'block text-base',
                                    isSelected && !isRevealed && 'font-medium text-gray-900 dark:text-white',
                                    !isSelected && !isRevealed && 'text-gray-700 dark:text-gray-300',
                                    isRevealed && isSelected && isCorrect && 'font-semibold text-gray-900 dark:text-white',
                                    isRevealed && isSelected && !isCorrect && 'font-semibold text-gray-900 dark:text-white',
                                    isRevealed && !isSelected && isCorrect && 'font-medium text-emerald-900 dark:text-emerald-100',
                                    isRevealed && !isSelected && !isCorrect && 'text-gray-700 dark:text-gray-300'
                                  )}>
                                    {opt}
                                  </span>
                                  {isRevealed && !isSelected && isCorrect && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">
                                      Correct Answer
                                    </span>
                                  )}
                                </div>
                                {isRevealed && isSelected && (
                                  <div className={clsx(
                                    'size-6 rounded-full text-white flex items-center justify-center shrink-0',
                                    isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                  )}>
                                    {isCorrect ? <Check size={16} /> : <X size={16} />}
                                  </div>
                                )}
                              </label>
                            );
                          })}
                        </div>

                        {!revealedAnswers[index] && selectedAnswers[index] && (
                          <button
                            onClick={() => checkAnswer(index)}
                            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                          >
                            Check Answer
                          </button>
                        )}

                        {revealedAnswers[index] && (
                          <div className={clsx(
                            'mt-6 p-4 rounded-lg border text-sm',
                            isCorrectAnswer
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                              : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50 text-red-800 dark:text-red-200'
                          )}>
                            <span className="font-bold block mb-1">
                              {isCorrectAnswer ? 'Excellent!' : 'Not quite.'}
                            </span>
                            {isCorrectAnswer
                              ? 'You got it right!'
                              : `The correct answer is: ${q.answer}`}
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="flex justify-between items-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <span>Last edited just now</span>
            <div className="flex gap-4">
              <button className="hover:text-indigo-600 transition-colors">Regenerate Notes</button>
              <button className="hover:text-indigo-600 transition-colors">Report Issue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardItem: React.FC<{ card: Flashcard; index: number }> = ({ card, index }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="h-72 cursor-pointer group perspective"
      onClick={() => setFlipped(!flipped)}
      style={{ perspective: '1000px' }}
    >
      <div
        className={clsx(
          'relative w-full h-full transition-transform duration-500 shadow-lg rounded-2xl',
          flipped && '[transform:rotateY(180deg)]'
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center rounded-2xl border border-gray-100 dark:border-gray-700"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="absolute top-4 left-4 text-xs font-bold text-gray-400 dark:text-gray-500">
            Card {index + 1}
          </span>
          <p className="text-center font-semibold text-lg text-gray-900 dark:text-white px-4">
            {card.front}
          </p>
          <div className="absolute bottom-4 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <CircleDot size={12} />
            Click to flip
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-center rounded-2xl shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-center font-medium text-lg px-4">{card.back}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
