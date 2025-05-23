'use client';

import { useState } from 'react';
import { startGoogleLogin, testLocalStorage } from '@/utils/zkLogin';

interface GoogleLoginButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export default function GoogleLoginButton({ 
  className = '', 
  size = 'md',
  variant = 'primary' 
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Test localStorage before starting login
      console.log('Testing localStorage before login...');
      testLocalStorage();
      
      await startGoogleLogin();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700'
  };

  return (
    <div className="w-full">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`
          inline-flex items-center justify-center w-full
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          font-medium rounded-lg
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">Configuration Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {error.includes('Google Client ID not configured') && (
                <div className="mt-2 text-xs text-red-600">
                  <p>Please ensure your .env.local file contains:</p>
                  <code className="block mt-1 p-1 bg-red-100 rounded text-xs">
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 