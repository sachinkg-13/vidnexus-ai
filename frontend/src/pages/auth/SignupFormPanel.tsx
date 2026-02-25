import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, User, Mail, Lock, ArrowRight } from 'lucide-react';

interface ValidationErrors {
  username?: string[];
  email?: string[];
  password?: string[];
  password2?: string[];
  non_field_errors?: string[];
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface SignupFormPanelProps {
  onSwitchToLogin?: () => void;
}

const SignupFormPanel: React.FC<SignupFormPanelProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Password strength calculator
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 4) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/register/', formData);
      
      if (response.status === 201) {
        // Auto-login successful - cookies are set
        await checkAuthStatus(); // Update auth context
        navigate('/dashboard'); // Redirect to dashboard
      }
    } catch (error: any) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ non_field_errors: ['Registration failed. Please try again.'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base">
          Join VidNexus AI to start generating notes
        </p>
      </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* General Errors */}
          {errors.non_field_errors && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">
                {errors.non_field_errors.map((error, idx) => (
                  <span key={idx}>{error}</span>
                ))}
              </p>
            </div>
          )}

          {/* Username Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-gray-900 dark:text-gray-200 text-sm font-bold ml-1">
              Username
            </label>
            <div className="relative flex items-center group">
              <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                <User className="text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500/50 rounded-xl text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all duration-200 shadow-sm"
                placeholder="Choose a username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 ml-1">
                <XCircle className="w-4 h-4" />
                {errors.username[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-900 dark:text-gray-200 text-sm font-bold ml-1">
              Email Address
            </label>
            <div className="relative flex items-center group">
              <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500/50 rounded-xl text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all duration-200 shadow-sm"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 ml-1">
                <XCircle className="w-4 h-4" />
                {errors.email[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-900 dark:text-gray-200 text-sm font-bold ml-1">
              Password
            </label>
            <div className="relative flex items-center group">
              <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-14 pl-12 pr-12 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500/50 rounded-xl text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all duration-200 shadow-sm"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-1 px-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Password Strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.score <= 2 ? 'text-red-600 dark:text-red-400' :
                    passwordStrength.score === 3 ? 'text-yellow-600 dark:text-yellow-400' :
                    passwordStrength.score === 4 ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 ml-1">
                <XCircle className="w-4 h-4" />
                {errors.password[0]}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password2" className="text-gray-900 dark:text-gray-200 text-sm font-bold ml-1">
              Confirm Password
            </label>
            <div className="relative flex items-center group">
              <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="w-full h-14 pl-12 pr-12 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500/50 rounded-xl text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all duration-200 shadow-sm"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password Match Indicator */}
            {formData.password2 && (
              <p className={`text-sm flex items-center gap-1 px-1 ${
                formData.password === formData.password2 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formData.password === formData.password2 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Passwords must match
                  </>
                )}
              </p>
            )}
            {errors.password2 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 ml-1">
                <XCircle className="w-4 h-4" />
                {errors.password2[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:to-indigo-600 hover:shadow-lg hover:shadow-indigo-600/30 text-white text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="flex justify-center mt-2">
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Already have an account?{' '}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
              >
                Sign in
              </button>
            ) : (
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                Sign in
              </Link>
            )}
          </p>
        </div>
      </div>
  );
};

export default SignupFormPanel;
