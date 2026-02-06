import React from 'react';

const LoginGradientPanel: React.FC = () => {
  return (
    <div className="flex w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 items-center justify-center p-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        {/* Decorative Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg">
        {/* Modern Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold text-white/90">AI-Powered Learning</span>
        </div>

        <h1 className="text-5xl font-black text-white mb-6 leading-tight">
          Welcome Back to<br/>Smart Learning
        </h1>
        <p className="text-xl text-indigo-100 mb-12 leading-relaxed">
          Continue your journey of transforming videos into comprehensive study materials.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm text-indigo-100">Active Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
            <div className="text-3xl font-bold text-white mb-1">50K+</div>
            <div className="text-sm text-indigo-100">Notes Generated</div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Save hours with instant summaries</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Master concepts with AI flashcards</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Test yourself with smart quizzes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginGradientPanel;
