import React from 'react';
import { motion } from 'framer-motion';

const BadgeDisplay = ({ badges = [], availableBadges = [], loading = false }) => {
    const badgeEmojis = {
        'first_login': '🎉',
        'first_concept': '🌱',
        '10_concepts': '🌿',
        '25_concepts': '🌳',
        '50_concepts': '🏆',
        '7_day_streak': '🔥',
        'misconception_buster': '💡',
        'knowledge_explorer': '🗺️',
        'question_master': '❓',
        'golden_leaves': '🍂'
    };

    const earnedBadgeKeys = badges.map(b => b.badge?.key || b.key);

    const allBadges = availableBadges.map(badge => ({
        ...badge,
        earned: earnedBadgeKeys.includes(badge.key),
        emoji: badgeEmojis[badge.key] || '⭐'
    }));

    if (loading) {
        return (
            <div style={styles.container}>
                <h3 style={styles.title}>Your Achievements</h3>
                <div style={styles.loading}>Loading badges...</div>
            </div>
        );
    }

    const earnedCount = allBadges.filter(b => b.earned).length;
    const totalCount = allBadges.length;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Your Achievements</h3>
                <div style={styles.progress}>
                    {earnedCount} / {totalCount} Unlocked
                </div>
            </div>

            <div style={styles.badgeGrid}>
                {allBadges.map((badge, index) => (
                    <BadgeCard
                        key={badge.key}
                        badge={badge}
                        index={index}
                    />
                ))}
            </div>

            {earnedCount === 0 && (
                <div style={styles.emptyState}>
                    <div style={styles.emptyEmoji}>🎯</div>
                    <div style={styles.emptyText}>
                        Start your journey to unlock achievements!
                    </div>
                </div>
            )}
        </div>
    );
};

const BadgeCard = ({ badge, index }) => {
    const isEarned = badge.earned;

    return (
        <motion.div
            style={{
                ...styles.badgeCard,
                opacity: isEarned ? 1 : 0.4,
                background: isEarned
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isEarned ? 1 : 0.4, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: isEarned ? 1.05 : 1, y: isEarned ? -5 : 0 }}
        >
            <div style={styles.badgeIcon}>
                {badge.emoji}
            </div>
            <div style={{
                ...styles.badgeTitle,
                color: isEarned ? 'white' : '#666'
            }}>
                {badge.title}
            </div>
            {badge.description && (
                <div style={{
                    ...styles.badgeDescription,
                    color: isEarned ? 'rgba(255,255,255,0.9)' : '#888'
                }}>
                    {badge.description}
                </div>
            )}
            {!isEarned && (
                <div style={styles.lockedBadge}>
                    🔒 Locked
                </div>
            )}
            {isEarned && (
                <motion.div
                    style={styles.earnedBadge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                >
                    ✓ Earned
                </motion.div>
            )}
        </motion.div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    title: {
        margin: 0,
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    progress: {
        padding: '0.5rem 1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '0.9rem'
    },
    badgeGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem'
    },
    badgeCard: {
        padding: '1.5rem',
        borderRadius: '15px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
    },
    badgeIcon: {
        fontSize: '3rem',
        marginBottom: '0.75rem',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    },
    badgeTitle: {
        fontWeight: 'bold',
        fontSize: '1.1rem',
        marginBottom: '0.5rem'
    },
    badgeDescription: {
        fontSize: '0.85rem',
        lineHeight: '1.4',
        marginTop: '0.5rem'
    },
    lockedBadge: {
        marginTop: '0.75rem',
        fontSize: '0.85rem',
        color: '#999',
        fontWeight: '600'
    },
    earnedBadge: {
        marginTop: '0.75rem',
        fontSize: '0.85rem',
        color: '#FFD700',
        fontWeight: '600',
        textShadow: '0 0 10px rgba(255,215,0,0.5)'
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem 1rem',
        color: '#999'
    },
    emptyEmoji: {
        fontSize: '4rem',
        marginBottom: '1rem'
    },
    emptyText: {
        fontSize: '1.2rem',
        fontWeight: '500'
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#999'
    }
};

export default BadgeDisplay;
