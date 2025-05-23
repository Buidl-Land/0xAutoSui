'use client';

import { useState } from 'react';
import { useZkLogin } from '@/contexts/ZkLoginContext';

export default function UserProfile() {
  const { session, logout } = useZkLogin();
  const [copied, setCopied] = useState(false);

  if (!session) {
    return null;
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Welcome!</h2>
        <p className="text-sm text-gray-600">Your Sui zkLogin is active</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sui Wallet Address
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 rounded-lg p-3 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{formatAddress(session.userAddress)}</span>
                <button
                  onClick={() => copyToClipboard(session.userAddress)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Copy full address"
                >
                  {copied ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-1">Address copied to clipboard!</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Address
          </label>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs break-all text-gray-700">
            {session.userAddress}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs break-all text-gray-700">
            {session.sub}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 