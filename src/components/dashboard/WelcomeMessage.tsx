'use client';

import React from 'react';

interface WelcomeMessageProps {
  username?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ username }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white">
        Welcome back, {username || 'User'}!
      </h1>
    </div>
  );
};

export default WelcomeMessage;