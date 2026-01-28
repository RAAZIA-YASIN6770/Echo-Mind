import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TreePine, MessageCircle, Trophy, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import StreakCounter from '../components/StreakCounter';
import BadgeDisplay from '../components/BadgeDisplay';
import ChallengeCard from '../components/ChallengeCard';
import Button from '../components/ui/Button';
import { FeatureCard, StatCard } from '../components/ui/Card';

const HomePage = () => {
    const navigate = useNavigate();
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
            const analytics = analyticsData.analytics || {};
            setStats({
                concepts: analytics.concepts?.total || 0,
                masteredConcepts: analytics.concepts?.mastered || 0,
                streak: streakRes.data.streak?.current || 0,
                bestStreak: streakRes.data.streak?.best || 0,
                badges: badgesRes.data.badges?.length || 0,
                treeHealth: analytics.tree_health || 0
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: <MessageCircle size={48} />,
            title: 'Chat with AI',
            description: 'Engage in Socratic conversations with your AI mentor',
            link: '/chat',
            color: 'var(--color-indigo)',
            delay: 0.3
        },
        {
            icon: <TreePine size={48} />,
            title: 'Knowledge Tree',
            description: 'Watch your learning grow with every concept mastered',
            link: '/tree',
            color: 'var(--color-success)',
            delay: 0.4
        },
        {
            icon: <Trophy size={48} />,
            title: 'Achievements',
            description: 'Earn badges and rewards for your learning milestones',
            link: '/achievements',
            color: '#F59E0B',
            delay: 0.5
        },
        {
            icon: <ShieldCheck size={48} />,
            title: 'Safe Learning',
            description: 'Content moderation and crisis detection for your safety',
            link: '/settings',
            color: '#EF4444',
            delay: 0.6
        }
    ];

    return (
        <main className="container home-container" aria-label="Home page">
            {/* Hero Section */}
            <section className="hero-section" aria-labelledby="welcome-heading">
                <h1 id="welcome-heading" className="hero-title">
                    Welcome to <span className="gradient-text">EchoMind</span> 🌟
                </h1>
                <p className="hero-subtitle">
                    Your AI-powered Socratic mentor for curious minds
                </p>
            </section>

            {/* Streak Counter */}
            <section className="streak-section" aria-label="Learning streak">
                <StreakCounter
                    currentStreak={stats.streak}
                    bestStreak={stats.bestStreak}
                    loading={loading}
                />
            </section>

            {/* Feature Cards */}
            <section className="features-grid" aria-label="Main features">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.link}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        color={feature.color}
                        delay={feature.delay}
                        onClick={() => navigate(feature.link)}
                    />
                ))}
            </section>

            {/* Stats Section */}
            <section className="stats-section" aria-labelledby="stats-heading">
                <div className="glass-panel stats-panel">
                    <h2 id="stats-heading" className="section-title">Your Learning Journey</h2>
                    <div className="stats-grid" role="list" aria-label="Learning statistics">
                        <StatCard icon="🌱" label="Concepts Learned" value={stats.concepts} loading={loading} />
                        <StatCard icon="✅" label="Mastered" value={stats.masteredConcepts} loading={loading} />
                        <StatCard icon="🏆" label="Badges Earned" value={stats.badges} loading={loading} />
                        <StatCard icon="💚" label="Tree Health" value={`${stats.treeHealth}%`} loading={loading} />
                    </div>
                </div>
            </section>

            {/* Daily Challenge */}
            <section className="challenge-section" aria-labelledby="challenge-heading">
                <h2 id="challenge-heading" className="section-title">Today's Challenge</h2>
                <ChallengeCard challenge={challenge} loading={loading} />
            </section>

            {/* Badges Section */}
            <section className="badges-section" aria-labelledby="badges-heading">
                <h2 id="badges-heading" className="section-title">Your Achievements</h2>
                <BadgeDisplay
                    badges={badges}
                    availableBadges={availableBadges}
                    loading={loading}
                />
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <Button
                    variant="primary"
                    size="lg"
                    icon={<Sparkles size={24} />}
                    onClick={() => navigate('/chat')}
                    ariaLabel="Start learning with AI mentor"
                >
                    Start Learning
                </Button>
            </section>
        </main>
    );
};

export default HomePage;
