import React from 'react';
import { motion } from 'framer-motion';

const StreakCounter = ({ currentStreak = 0, bestStreak = 0, loading = false }) => {
    const getStreakColor = (streak) => {
        if (streak >= 30) return '#FFD700'; // Gold
        if (streak >= 14) return '#FF6B6B'; // Red
        if (streak >= 7) return '#FF8C42';  // Orange
        if (streak >= 3) return '#4ECDC4';  // Teal
        return '#95E1D3'; // Light teal
    };

    const getStreakMessage = (streak) => {
        if (streak === 0) return "Start your journey!";
        if (streak === 1) return "Great start!";
        if (streak >= 30) return "Legendary streak! 🏆";
        if (streak >= 14) return "Two weeks strong! 💪";
        if (streak >= 7) return "One week milestone! 🎉";
        if (streak >= 3) return "Keep it going! 🔥";
        return "Building momentum! ⭐";
    };

    if (loading) {
        return (
            <div className="streak-card" style={styles.card}>
                <div style={styles.loading}>Loading...</div>
            </div>
        );
    }

    return (
        <motion.div
            className="streak-card"
            style={{
                ...styles.card,
                borderColor: getStreakColor(currentStreak)
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div style={styles.header}>
                <h3 style={styles.title}>Daily Streak</h3>
            </div>

            <motion.div
                style={{
                    ...styles.streakNumber,
                    color: getStreakColor(currentStreak)
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: currentStreak > 0 ? Infinity : 0, repeatDelay: 2 }}
            >
                <span style={styles.fireEmoji}>🔥</span>
                <span style={styles.number}>{currentStreak}</span>
            </motion.div>

            <div style={styles.message}>{getStreakMessage(currentStreak)}</div>

            <div style={styles.divider}></div>

            <div style={styles.bestStreak}>
                <span style={styles.label}>Best Streak:</span>
                <span style={styles.bestNumber}>
                    <span style={styles.trophyEmoji}>🏆</span> {bestStreak} days
                </span>
            </div>

            {currentStreak >= 5 && (
                <motion.div
                    style={styles.goldenLeaves}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    🍂 Golden Leaves Unlocked!
                </motion.div>
            )}
        </motion.div>
    );
};

const styles = {
    card: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '2rem',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        border: '3px solid',
        minWidth: '280px',
        position: 'relative',
        overflow: 'hidden'
    },
    header: {
        marginBottom: '1rem'
    },
    title: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: '600',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    streakNumber: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        margin: '1.5rem 0',
        fontSize: '4rem',
        fontWeight: 'bold',
        textShadow: '0 4px 10px rgba(0,0,0,0.3)'
    },
    fireEmoji: {
        fontSize: '3rem',
        filter: 'drop-shadow(0 0 10px rgba(255,100,0,0.5))'
    },
    number: {
        fontFamily: 'monospace'
    },
    message: {
        textAlign: 'center',
        fontSize: '1.1rem',
        fontWeight: '500',
        marginBottom: '1.5rem',
        opacity: 0.9
    },
    divider: {
        height: '2px',
        background: 'rgba(255,255,255,0.3)',
        margin: '1rem 0'
    },
    bestStreak: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1rem',
        opacity: 0.9
    },
    label: {
        fontWeight: '500'
    },
    bestNumber: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 'bold',
        fontSize: '1.1rem'
    },
    trophyEmoji: {
        fontSize: '1.5rem'
    },
    goldenLeaves: {
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(255,215,0,0.2)',
        borderRadius: '10px',
        textAlign: 'center',
        fontWeight: '600',
        border: '2px solid rgba(255,215,0,0.5)'
    },
    loading: {
        textAlign: 'center',
        padding: '2rem',
        fontSize: '1.2rem'
    }
};

export default StreakCounter;
