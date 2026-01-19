import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import BadgeDisplay from '../components/BadgeDisplay';

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

    return (
        <div className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <h1 style={{ fontSize: '3rem' }}>Your Trophy Room 🏆</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
                    Every badge represents a new peak you've climbed!
                </p>
            </motion.div>

            <BadgeDisplay
                badges={badges}
                availableBadges={availableBadges}
                loading={loading}
            />

            <motion.div
                style={{ marginTop: '3rem', textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h3>How to earn more?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
                    <div className="card">
                        <div style={{ fontSize: '2rem' }}>🔥</div>
                        <h4>Daily Streak</h4>
                        <p>Learn every day to unlock streak bonuses.</p>
                    </div>
                    <div className="card">
                        <div style={{ fontSize: '2rem' }}>🧠</div>
                        <h4>Master Concepts</h4>
                        <p>Grow your tree by mastering new topics.</p>
                    </div>
                    <div className="card">
                        <div style={{ fontSize: '2rem' }}>🤝</div>
                        <h4>Help Others</h4>
                        <p>Teach what you learned to your family!</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AchievementsPage;
