import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import BadgeDisplay from '../components/BadgeDisplay';
import Card from '../components/ui/Card';

/**
 * AchievementsPage - Refactored for Week 2 Finalization
 * Uses Card components, fully responsive, dark mode support
 */
const AchievementsPage = () => {
    const [badges, setBadges] = useState([]);
    const [availableBadges, setAvailableBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        setLoading(true);
        try {
            const [badgesRes, availableRes] = await Promise.all([
                api.get('/gamification/achievements/badges/'),
                api.get('/gamification/achievements/available/')
            ]);
            setBadges(badgesRes.data.badges || []);
            setAvailableBadges(availableRes.data.badges || []);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const howToEarn = [
        {
            icon: '🔥',
            title: 'Daily Streak',
            description: 'Learn every day to unlock streak bonuses.',
        },
        {
            icon: '🧠',
            title: 'Master Concepts',
            description: 'Grow your tree by mastering new topics.',
        },
        {
            icon: '🤝',
            title: 'Help Others',
            description: 'Teach what you learned to your family!',
        },
    ];

    return (
        <main className="container achievements-page">
            {/* Page Header */}
            <motion.div
                className="page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="hero-title">Your Trophy Room 🏆</h1>
                <p className="hero-subtitle">
                    Every badge represents a new peak you've climbed!
                </p>
            </motion.div>

            {/* Badge Display */}
            <BadgeDisplay
                badges={badges}
                availableBadges={availableBadges}
                loading={loading}
            />

            {/* How to Earn Section */}
            <motion.div
                className="how-to-earn-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="section-title" style={{ textAlign: 'center' }}>
                    How to earn more?
                </h3>
                <div className="how-to-earn-grid">
                    {howToEarn.map((item, index) => (
                        <Card
                            key={item.title}
                            hover={true}
                            elevation="sm"
                            className="how-to-earn-card"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="how-to-earn-content"
                            >
                                <div className="earn-icon">{item.icon}</div>
                                <h4 className="earn-title">{item.title}</h4>
                                <p className="earn-description">{item.description}</p>
                            </motion.div>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </main>
    );
};

export default AchievementsPage;
