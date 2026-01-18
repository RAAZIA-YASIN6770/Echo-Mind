import React from 'react';
import { motion } from 'framer-motion';

const ChallengeCard = ({ challenge, loading = false }) => {
    if (loading) {
        return (
            <div style={styles.card}>
                <div style={styles.loading}>Loading today's challenge...</div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div style={styles.card}>
                <div style={styles.emptyState}>
                    <div style={styles.emptyEmoji}>🎯</div>
                    <div style={styles.emptyText}>No challenge available</div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            style={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div style={styles.header}>
                <div style={styles.badge}>
                    <span style={styles.badgeEmoji}>🌟</span>
                    <span style={styles.badgeText}>Daily Challenge</span>
                </div>
                <div style={styles.duration}>
                    ⏱️ {challenge.duration_minutes || 5} min
                </div>
            </div>

            <motion.div
                style={styles.challengeIcon}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
                🎨
            </motion.div>

            <div style={styles.challengeText}>
                {challenge.text}
            </div>

            <div style={styles.tips}>
                <div style={styles.tipsTitle}>💡 Tips:</div>
                <ul style={styles.tipsList}>
                    <li>Take your time and be creative!</li>
                    <li>This is an offline activity</li>
                    <li>Share your results with family</li>
                </ul>
            </div>

            <motion.button
                style={styles.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert('Challenge accepted! Have fun! 🎉')}
            >
                Accept Challenge 🚀
            </motion.button>
        </motion.div>
    );
};

const styles = {
    card: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: '20px',
        padding: '2rem',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255,255,255,0.2)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
    },
    badgeEmoji: {
        fontSize: '1.2rem'
    },
    badgeText: {
        fontWeight: '600',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    duration: {
        background: 'rgba(255,255,255,0.2)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        backdropFilter: 'blur(10px)'
    },
    challengeIcon: {
        fontSize: '4rem',
        textAlign: 'center',
        margin: '1rem 0',
        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))'
    },
    challengeText: {
        fontSize: '1.3rem',
        fontWeight: '500',
        lineHeight: '1.6',
        textAlign: 'center',
        margin: '1.5rem 0',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.3)'
    },
    tips: {
        background: 'rgba(255,255,255,0.1)',
        padding: '1rem',
        borderRadius: '10px',
        marginTop: '1.5rem',
        backdropFilter: 'blur(10px)'
    },
    tipsTitle: {
        fontWeight: '600',
        marginBottom: '0.5rem',
        fontSize: '1rem'
    },
    tipsList: {
        margin: '0.5rem 0 0 0',
        paddingLeft: '1.5rem',
        fontSize: '0.9rem',
        lineHeight: '1.8'
    },
    button: {
        width: '100%',
        padding: '1rem 2rem',
        marginTop: '1.5rem',
        background: 'white',
        color: '#f5576c',
        border: 'none',
        borderRadius: '30px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
    },
    loading: {
        textAlign: 'center',
        padding: '2rem',
        fontSize: '1.2rem'
    },
    emptyState: {
        textAlign: 'center',
        padding: '2rem'
    },
    emptyEmoji: {
        fontSize: '3rem',
        marginBottom: '1rem'
    },
    emptyText: {
        fontSize: '1.1rem',
        opacity: 0.9
    }
};

export default ChallengeCard;
