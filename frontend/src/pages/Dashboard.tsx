import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { Sparkles, Search, Plus, Calendar, Clock, ExternalLink, MoreHorizontal, Heart, Archive, Filter, Moon, Sun, LogOut, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

interface Note {
  id: number;
  youtube_url: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'a-z' | 'z-a' | 'newest' | 'oldest'>('newest');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  useEffect(() => {
    client.get('/notes/')
      .then(res => setNotes(res.data))
      .catch(err => console.error(err));
  }, []);

  // Sort notes based on selected option
  const sortedNotes = [...notes].sort((a, b) => {
    switch (sortOption) {
      case 'a-z':
        return a.id - b.id;
      case 'z-a':
        return b.id - a.id;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  const handleSortChange = (option: 'a-z' | 'z-a' | 'newest' | 'oldest') => {
    setSortOption(option);
    setIsFilterOpen(false);
  };

  // Extract YouTube video ID for thumbnail
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
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : 'https://via.placeholder.com/320x180/6366f1/ffffff?text=Video';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getReadingTime = () => {
    return `${Math.floor(Math.random() * 10) + 5} min`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center justify-center size-10">
                <img src="/logo.png" alt="VidNexus AI" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight hidden sm:block">
                VidNexus AI
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-auto">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                  placeholder="Search your notes..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={toggleTheme}
                className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:to-indigo-600 text-white text-sm font-semibold py-2.5 px-5 rounded-full shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Note</span>
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                aria-label="Logout"
              >
                <LogOut size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">All Notes</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage and organize your AI-generated study materials.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="flex items-center gap-2 h-10 px-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium shadow-md whitespace-nowrap transition-transform hover:scale-105">
                All Notes
              </button>
              <button className="flex items-center gap-2 h-10 px-5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors">
                <Heart size={16} />
                Favorites
              </button>
              <button className="flex items-center gap-2 h-10 px-5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors">
                <Archive size={16} />
                Archived
              </button>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 shrink-0"></div>
            <div className="relative shrink-0">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 h-10 px-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Sort</span>
                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsFilterOpen(false)}
                  ></div>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sort By</p>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => handleSortChange('newest')}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span>Newest First</span>
                        {sortOption === 'newest' && <Check size={16} className="text-indigo-600" />}
                      </button>
                      
                      <button
                        onClick={() => handleSortChange('oldest')}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span>Oldest First</span>
                        {sortOption === 'oldest' && <Check size={16} className="text-indigo-600" />}
                      </button>
                      
                      
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notes yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              Start by generating your first note from a YouTube video
            </p>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all"
            >
              <Plus size={20} />
              Generate First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => navigate(`/notes/${note.id}`)}
                className="group relative bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${getYouTubeThumbnail(note.youtube_url)}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Note ID Badge */}
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 tracking-wide uppercase">
                    #N-{note.id}
                  </span>

                  {/* More Options */}
                  <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-indigo-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                    Note #{note.id}
                  </h3>

                  <a
                    href={note.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-700 mb-4 truncate max-w-full font-medium"
                  >
                    <ExternalLink size={14} className="mr-1 flex-shrink-0" />
                    {note.youtube_url.length > 35 ? note.youtube_url.substring(0, 35) + '...' : note.youtube_url}
                  </a>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-4 mt-2">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        {formatDate(note.created_at)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        {getReadingTime()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          navigate('/');
        }}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You'll need to sign in again to access your notes."
        confirmText="Logout"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};

export default Dashboard;
