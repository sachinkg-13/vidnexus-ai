import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../api/client';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormPanelProps {
  onSwitchToSignup?: () => void;
}

const LoginFormPanel: React.FC<LoginFormPanelProps> = ({ onSwitchToSignup }) => {
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
    <div className="w-full flex flex-col gap-8">
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
  );
};

export default LoginFormPanel;
