import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, TreePine, MessageCircle, Trophy, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import StreakCounter from '../components/StreakCounter';
import BadgeDisplay from '../components/BadgeDisplay';
import ChallengeCard from '../components/ChallengeCard';

const HomePage = () => {
    const [stats, setStats] = useState({
        concepts: 0,
        masteredConcepts: 0,
        streak: 0,
        bestStreak: 0,
        badges: 0,
        treeHealth: 0
    });
    const [streakData, setStreakData] = useState(null);
    const [badges, setBadges] = useState([]);
    const [availableBadges, setAvailableBadges] = useState([]);
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch analytics
            const analyticsRes = await api.get('/gamification/analytics/');
            const analyticsData = analyticsRes.data;

            // Fetch streak
            const streakRes = await api.get('/gamification/streak/');
            setStreakData(streakRes.data);

            // Fetch badges
            const badgesRes = await api.get('/gamification/achievements/badges/');
            setBadges(badgesRes.data.badges || []);

            // Fetch available badges
            const availableRes = await api.get('/gamification/achievements/available/');
            setAvailableBadges(availableRes.data.badges || []);

            // Fetch daily challenge
            const challengeRes = await api.get('/gamification/challenges/daily/');
            setChallenge(challengeRes.data.challenge);

            // Update stats
            const analytics = analyticsData.analytics;
            setStats({
                concepts: analytics.concepts.total || 0,
                masteredConcepts: analytics.concepts.mastered || 0,
                streak: streakRes.data.streak.current || 0,
                bestStreak: streakRes.data.streak.best || 0,
                badges: badgesRes.data.badges?.length || 0,
                treeHealth: analytics.tree_health || 0
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
            {/* Hero Section */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    Welcome to <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EchoMind</span> 🌟
                </h1>
                <p style={{ fontSize: '1.3rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    Your AI-powered Socratic mentor for curious minds
                </p>
            </motion.div>

            {/* Streak Counter */}
            <motion.div
                style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <StreakCounter
                    currentStreak={stats.streak}
                    bestStreak={stats.bestStreak}
                    loading={loading}
                />
            </motion.div>

            {/* Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <FeatureCard
                    icon={<MessageCircle size={40} />}
                    title="Chat with AI"
                    description="Ask questions and learn through guided discovery"
                    link="/chat"
                    color="#667eea"
                    delay={0.3}
                />
                <FeatureCard
                    icon={<TreePine size={40} />}
                    title="Knowledge Tree"
                    description="Watch your understanding grow with every concept"
                    link="/tree"
                    color="#764ba2"
                    delay={0.4}
                />
                <FeatureCard
                    icon={<ShieldCheck size={40} />}
                    title="Parent Portal"
                    description="Monitor safety alerts and review learning progress"
                    link="/parents"
                    color="#4F46E5"
                    delay={0.6}
                />
            </div>

            {/* Stats Section */}
            <motion.div
                className="glass-panel"
                style={{ padding: '2rem', marginBottom: '3rem' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Learning Journey</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <StatCard icon="🌱" label="Concepts Learned" value={stats.concepts} loading={loading} />
                    <StatCard icon="✅" label="Mastered" value={stats.masteredConcepts} loading={loading} />
                    <StatCard icon="🏆" label="Badges Earned" value={stats.badges} loading={loading} />
                    <StatCard icon="💚" label="Tree Health" value={`${stats.treeHealth}%`} loading={loading} />
                </div>
            </motion.div>

            {/* Daily Challenge */}
            <motion.div
                style={{ marginBottom: '3rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Today's Challenge</h2>
                <ChallengeCard challenge={challenge} loading={loading} />
            </motion.div>

            {/* Badges Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <BadgeDisplay
                    badges={badges}
                    availableBadges={availableBadges}
                    loading={loading}
                />
            </motion.div>

            {/* CTA Section */}
            <motion.div
                style={{ textAlign: 'center', marginTop: '3rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
            >
                <Link to="/chat" style={{ textDecoration: 'none' }}>
                    <motion.button
                        className="btn btn-primary"
                        style={{ fontSize: '1.2rem', padding: '1rem 3rem', borderRadius: 'var(--radius-full)' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Sparkles size={24} style={{ marginRight: '0.5rem' }} />
                        Start Learning
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, link, color, delay }) => {
    return (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <motion.div
                className="card"
                style={{
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderTop: `4px solid ${color}`,
                    height: '100%'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.4 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            >
                <div style={{ color, marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{description}</p>
            </motion.div>
        </Link>
    );
};

const StatCard = ({ icon, label, value, loading }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                {loading ? '...' : value}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{label}</div>
        </div>
    );
};

export default HomePage;
