import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ThemeToggle Component - Story 1.3
 * Accessible theme toggle with smooth animations
 * Sun icon for light mode, Moon icon for dark mode
 * Keyboard accessible with ARIA labels
 */
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            aria-pressed={isDark}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
        >
            <motion.div
                className="theme-toggle-icon"
                initial={false}
                animate={{
                    rotate: isDark ? 360 : 0,
                    scale: isDark ? 1 : 1,
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                {isDark ? (
                    <Moon size={20} strokeWidth={2} aria-hidden="true" />
                ) : (
                    <Sun size={20} strokeWidth={2} aria-hidden="true" />
                )}
            </motion.div>

            {/* Screen reader only text */}
            <span className="sr-only">
                {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
        </motion.button>
    );
};

export default ThemeToggle;
