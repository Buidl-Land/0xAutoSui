'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleOAuthCallback } from '@/utils/zkLogin';
import { useZkLogin } from '@/contexts/ZkLoginContext';

export default function AuthCallback() {
  const router = useRouter();
  const { refreshSession } = useZkLogin();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get hash parameters from URL
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        if (!hashParams.get('id_token')) {
          throw new Error('No ID token found in callback');
        }

        // Handle the OAuth callback
        await handleOAuthCallback(hashParams);
        
        // Refresh session in context
        refreshSession();
        
        setStatus('success');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
        
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
        
        // Redirect to home page after error
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    processCallback();
  }, [router, refreshSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Processing Login...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we complete your authentication.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Login Successful!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting to dashboard...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Login Failed
              </h2>
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting to home page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 