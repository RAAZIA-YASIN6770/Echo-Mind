import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * Theme Context - Story 1.1
 * Provides theme state management for light/dark mode
 * Persists theme preference in localStorage
 * Respects system preference on first visit
 */

// Create context with default values
const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => { },
    toggleTheme: () => { },
});

/**
 * ThemeProvider Component
 * Wraps the entire application to provide theme context
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState('light');
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        try {
            // Check localStorage first
            const savedTheme = localStorage.getItem('echomind-theme');

            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                setThemeState(savedTheme);
            } else {
                // Detect system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const systemTheme = prefersDark ? 'dark' : 'light';
                setThemeState(systemTheme);

                // Save system preference to localStorage
                localStorage.setItem('echomind-theme', systemTheme);
            }
        } catch (error) {
            // Handle localStorage not available (private browsing, etc.)
            console.warn('localStorage not available, using default theme:', error);
            setThemeState('light');
        }

        setIsInitialized(true);
    }, []);

    // Apply theme to document root
    useEffect(() => {
        if (!isInitialized) return;

        // Set data-theme attribute for CSS targeting
        document.documentElement.setAttribute('data-theme', theme);

        // Add theme class for additional styling options
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
        }
    }, [theme, isInitialized]);

    // Set theme and persist to localStorage
    const setTheme = (newTheme) => {
        if (newTheme !== 'light' && newTheme !== 'dark') {
            console.error('Invalid theme:', newTheme);
            return;
        }

        setThemeState(newTheme);

        try {
            localStorage.setItem('echomind-theme', newTheme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    };

    // Toggle between light and dark
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * useTheme Hook
 * Custom hook for accessing theme context
 * Throws error if used outside ThemeProvider
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

export default ThemeContext;
