import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import {User, Lock, ArrowRight, RectangleGoggles, GitBranchPlus, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onSwitchToSignup?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await client.post('/auth/login/', { username, password });
      // Refresh auth status to get user info
      await checkAuthStatus();
      console.log('Login successful:', response.data);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Panel (40%) - Modern Gradient Design */}
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 items-center justify-center p-12 relative overflow-hidden">
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

      {/* Right Panel (60%) - Scrollable if needed, Flex centered */}
      <div className="w-full lg:w-[60%] h-full flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          {/* Logo & Heading */}
          <div className="flex flex-col gap-3 text-center sm:text-left">
            {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden h-12 w-12 mb-2 mx-auto sm:mx-0">
            <img src="/logo.png" alt="VidNexus AI" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Please enter your details to access your notes.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Username Field */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 dark:text-gray-200 text-sm font-bold ml-1">
                Username
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                </div>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500/50 rounded-xl text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all duration-200 shadow-sm"
                  placeholder="Enter your username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 dark:text-gray-200 text-sm font-bold ml-1">
                Password
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                </div>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500/50 rounded-xl text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all duration-200 shadow-sm"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center mt-1 px-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600/50"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors" href="#">
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:to-indigo-600 hover:shadow-lg hover:shadow-indigo-600/30 text-white text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              <span>Sign In</span>
              <ArrowRight size={20} />
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Or continue with
              </span>
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 h-12 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
              >
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="/google.svg"
                />
                <span className="text-sm font-bold text-gray-900 dark:text-white">Google</span>
              </button>
                <button
                type="button"
                className="flex items-center justify-center gap-3 h-12 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                >
                <img
                  alt="GitHub"
                  className="w-5 h-5"
                  src="/github.svg"
                />
                <span className="text-sm font-bold text-gray-900 dark:text-white">GitHub</span>
                </button>
            </div>

            {/* Sign Up Link */}
            <div className="flex justify-center mt-2">
              <p className="text-gray-600 dark:text-gray-400 text-base">
                Don't have an account?{' '}
                {onSwitchToSignup ? (
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
                  >
                    Sign up
                  </button>
                ) : (
                  <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                    Sign up
                  </Link>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
