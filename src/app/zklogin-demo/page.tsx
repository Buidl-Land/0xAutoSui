'use client';

import { useZkLogin } from '@/contexts/ZkLoginContext';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import UserProfile from '@/components/auth/UserProfile';

export default function ZkLoginDemo() {
  const { isAuthenticated, loading } = useZkLogin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sui zkLogin Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience seamless Web3 authentication with Sui zkLogin. 
            Login with your Google account and get your unique Sui wallet address.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left side - Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How it works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Google Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Click the login button to authenticate with your Google account
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Zero-Knowledge Proof</h3>
                  <p className="text-sm text-gray-600">
                    Your identity is verified using zero-knowledge cryptography
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Sui Address Generation</h3>
                  <p className="text-sm text-gray-600">
                    A unique Sui wallet address is derived from your Google account
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Benefits</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• No need to manage private keys</li>
                <li>• Seamless Web2 to Web3 onboarding</li>
                <li>• Enhanced security with zero-knowledge proofs</li>
                <li>• Same address across all sessions</li>
              </ul>
            </div>
          </div>

          {/* Right side - Login/Profile */}
          <div>
            {!isAuthenticated ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click below to login with Google and generate your Sui wallet address
                  </p>
                </div>
                
                <GoogleLoginButton 
                  size="lg" 
                  className="w-full"
                />
                
                <p className="text-xs text-gray-500 mt-4">
                  By continuing, you agree to our terms of service and privacy policy
                </p>
              </div>
            ) : (
              <UserProfile />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <a 
              href="https://sui.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Sui Network
            </a>
            {' '}and{' '}
            <a 
              href="https://docs.sui.io/concepts/cryptography/zklogin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              zkLogin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 