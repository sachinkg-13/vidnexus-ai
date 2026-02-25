import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4">
      {/* Summary Skeleton */}
      <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 shadow-lg rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>

      {/* Flashcards Skeleton */}
      <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 shadow-lg rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Quiz Skeleton */}
      <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 shadow-lg rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
          <div className="h-6 w-28 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
              <div className="space-y-2 pl-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
