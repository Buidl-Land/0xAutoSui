'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  // Determine if the toggle should be checked (dark theme is active)
  const isChecked = theme === 'black-purple';

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className={`h-6 w-6 ${theme === 'blue-white' ? 'text-primary' : 'text-base-content/70'}`} />
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={isChecked}
        onChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <MoonIcon className={`h-6 w-6 ${theme === 'black-purple' ? 'text-primary' : 'text-base-content/70'}`} />
    </div>
  );
};

export default ThemeToggleButton;