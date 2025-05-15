'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const LightThemeBackgroundSVG = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', top: 0, left: 0, zIndex: -10, width: '100vw', height: '100vh' }}>
    <defs>
      <pattern id="lightGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
        {/* Using a light neutral color for the grid, e.g., from gray-200 or a theme variable like --n or --nc if appropriate */}
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--tw-color-gray-200, #e5e7eb)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    {/* Use base-100 for background fill, it's #ffffff for blue-white */}
    <rect width="100%" height="100%" fill="var(--b1, #ffffff)"/>
    <rect width="100%" height="100%" fill="url(#lightGridPattern)"/>
  </svg>
);

const DarkThemeBackgroundSVG = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'fixed', top: 0, left: 0, zIndex: -10, width: '100vw', height: '100vh' }}>
    <defs>
      <linearGradient id="darkBgGradientPattern" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'var(--b1, #111827)'}} /> {/* base-100 for black-purple */}
        <stop offset="100%" style={{stopColor: 'var(--b2, #1f2937)'}} /> {/* base-200 for black-purple */}
      </linearGradient>
      <pattern id="darkGridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--n, #1f2937)" strokeOpacity="0.5" strokeWidth="0.7"/> {/* neutral color for grid */}
        <circle cx="0" cy="0" r="1.2" fill="var(--p, #a855f7)" opacity="0.3"/> {/* primary color for dots */}
        <circle cx="15" cy="15" r="0.8" fill="var(--a, #c026d3)" opacity="0.2"/> {/* accent color for dots */}
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#darkBgGradientPattern)"/>
    <rect width="100%" height="100%" fill="url(#darkGridPattern)" />
  </svg>
);

const DynamicBackground = () => {
  const { theme } = useTheme();

  // The SVGs will now use CSS variables like var(--b1), var(--p), etc., set by DaisyUI themes.
  // No need for the `themeColors` object or setting style on the wrapping div here.

  return (
    <>
      {theme === 'black-purple' ? <DarkThemeBackgroundSVG /> : <LightThemeBackgroundSVG />}
    </>
  );
};

export default DynamicBackground;