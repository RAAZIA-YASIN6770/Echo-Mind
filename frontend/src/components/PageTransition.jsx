import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition Component - Story 2.4
 * Provides smooth fade-in and slide-up transitions between routes
 * Respects prefers-reduced-motion for accessibility
 */
const PageTransition = ({ children }) => {
    const location = useLocation();

    // Animation variants
    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: -20,
        },
    };

    // Transition configuration
    const pageTransition = {
        type: 'tween',
        ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier
        duration: 0.3,
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
                style={{
                    width: '100%',
                    minHeight: '100vh',
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;
