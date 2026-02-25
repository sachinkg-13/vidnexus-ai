import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LoginFormPanel,
  LoginGradientPanel,
  SignupFormPanel,
  SignupGradientPanel,
} from './auth';

const AuthContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const handleSwitch = (toLogin: boolean) => {
    if (isAnimating || isLogin === toLogin) return;

    setIsAnimating(true);
    setIsLogin(toLogin);

    setTimeout(() => {
      navigate(toLogin ? '/login' : '/signup', { replace: true });
    }, 50);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const duration = 'duration-700';
  const easing = 'ease-[cubic-bezier(0.4,0,0.2,1)]';

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
      {/* Desktop View - 4 independently positioned sections */}
      <div className="hidden lg:block h-full w-full">
        
        {/* Section 1: Signup Form - Left 50% */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 transition-all ${duration} ${easing} ${
            isLogin
              ? 'translate-x-full opacity-0'
              : 'translate-x-0 opacity-100'
          }`}
          style={{ zIndex: isLogin ? 10 : 30 }}
        >
          <div className="h-full w-full bg-white dark:bg-gray-900 flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-[480px]">
              <SignupFormPanel onSwitchToLogin={() => handleSwitch(true)} />
            </div>
          </div>
        </div>

        {/* Section 2: Signup Gradient - Right 50% */}
        <div
          className={`absolute top-0 right-0 h-full w-1/2 transition-all ${duration} ${easing} ${
            isLogin
              ? '-translate-x-full opacity-0'
              : 'translate-x-0 opacity-100'
          }`}
          style={{ zIndex: isLogin ? 10 : 30 }}
        >
          <SignupGradientPanel />
        </div>

        {/* Section 3: Login Gradient - Left 40% */}
        <div
          className={`absolute top-0 left-0 h-full w-[40%] transition-all ${duration} ${easing} ${
            isLogin
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          }`}
          style={{ zIndex: isLogin ? 30 : 10 }}
        >
          <LoginGradientPanel />
        </div>

        {/* Section 4: Login Form - Right 60% */}
        <div
          className={`absolute top-0 right-0 h-full w-[60%] transition-all ${duration} ${easing} ${
            isLogin
              ? 'translate-x-0 opacity-100'
              : '-translate-x-full opacity-0'
          }`}
          style={{ zIndex: isLogin ? 30 : 10 }}
        >
          <div className="h-full w-full bg-white dark:bg-gray-900 flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-[480px]">
              <LoginFormPanel onSwitchToSignup={() => handleSwitch(false)} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Simple fade transition */}
      <div className="lg:hidden h-full w-full">
        <div
          className={`absolute inset-0 transition-opacity ${duration} ${
            isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="h-full w-full bg-white dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-[480px]">
              <SignupFormPanel onSwitchToLogin={() => handleSwitch(true)} />
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-0 transition-opacity ${duration} ${
            isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="h-full w-full bg-white dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-[480px]">
              <LoginFormPanel onSwitchToSignup={() => handleSwitch(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;

