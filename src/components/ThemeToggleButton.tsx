'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleButtonProps {
  iconOnly?: boolean;
  showIcon?: boolean;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ iconOnly = false, showIcon = true }) => {
  const { theme, toggleTheme, isMounted } = useTheme();

  // Determine if the toggle should be checked (dark theme is active)
  const isChecked = theme === 'black-purple';

  if (!isMounted) {
    // Render a placeholder or null during server render and initial client render before mount
    if (iconOnly) return <div className="h-5 w-5" />; // Placeholder for iconOnly
    return ( // Placeholder for full toggle
      <div className="flex items-center space-x-2">
        {showIcon && <div className="h-6 w-6" />}
        <input
          type="checkbox"
          className="toggle toggle-primary"
          aria-label="Toggle theme placeholder"
          disabled
        />
        {showIcon && <div className="h-6 w-6" />}
      </div>
    );
  }

  if (iconOnly) {
    return theme === 'blue-white' ? (
      <SunIcon className="h-5 w-5 text-primary" />
    ) : (
      <MoonIcon className="h-5 w-5 text-primary" />
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {showIcon && <SunIcon className={`h-6 w-6 ${theme === 'blue-white' ? 'text-primary' : 'text-base-content/70'}`} />}
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={isChecked}
        onChange={toggleTheme}
        aria-label="Toggle theme"
      />
      {showIcon && <MoonIcon className={`h-6 w-6 ${theme === 'black-purple' ? 'text-primary' : 'text-base-content/70'}`} />}
    </div>
  );
};

export default ThemeToggleButton;