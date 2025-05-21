'use client';

import React from 'react';

interface WelcomeMessageProps {
  username?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ username }) => {
  return (
    <div className="mb-8 py-4"> {/* Added more margin bottom and some padding y */}
      <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent"> {/* Enlarged text, made bolder, and applied gradient */}
        Welcome back, {username || 'User'}!
      </h1>
    </div>
  );
};

export default WelcomeMessage;