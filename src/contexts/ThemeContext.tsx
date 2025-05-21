'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'blue-white' | 'black-purple';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isMounted: boolean; // Added to track client-side mount
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Removed getInitialTheme as logic will move to useEffect after mount

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('blue-white'); // Start with a consistent default
  const [isMounted, setIsMounted] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    applyTheme(newTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    // Access the current theme directly from the state
    const newTheme = theme === 'blue-white' ? 'black-purple' : 'blue-white';
    applyTheme(newTheme); // applyTheme handles setting state, localStorage, and data-theme attribute
  }, [theme, applyTheme]); // Add theme and applyTheme to dependencies


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        applyTheme(storedTheme);
      } else {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDarkMode ? 'black-purple' : 'blue-white');
      }
    }
  }, [isMounted, applyTheme]);

  useEffect(() => {
    if (isMounted) {
      // Ensure the data-theme attribute is set on initial load based on the resolved theme state
      document.documentElement.setAttribute('data-theme', theme);

      // Handle system theme changes if no theme is explicitly set by the user
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (!storedTheme) { // Only apply system theme if user hasn't set one
          const newSystemTheme = e.matches ? 'black-purple' : 'blue-white';
          applyTheme(newSystemTheme);
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [theme, applyTheme, isMounted]);
  if (!isMounted) {
    // Prevents flash of default theme before client-side hydration and theme resolution.
    // Children will only render once the correct theme is determined and applied.
    return null;
  }



  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};