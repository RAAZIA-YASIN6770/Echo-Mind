import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, CheckCircle, Lock, Unlock, Sparkles, Clock, Target } from 'lucide-react';
import AdaptiveEngine from '../services/AdaptiveEngine';
import { useTheme } from '../contexts/ThemeContext';

/**
 * LearningRoadmap Component - Story 3.3: Adaptive Learning Paths
 * 
 * Displays personalized learning recommendations based on user's
 * mastery levels and progress. Features:
 * - Adaptive recommendations (3 next best topics)
 * - Path unlocking animations
 * - Level up sound effects
 * - Mastery flash animations
 * - Dark mode support
 * - WCAG AAA accessibility
 */
const LearningRoadmap = ({ concepts = [], onTopicClick, className = '' }) => {
    const { theme } = useTheme();
    const [roadmap, setRoadmap] = useState(null);
    const [unlockedPaths, setUnlockedPaths] = useState([]);
    const [masteredPaths, setMasteredPaths] = useState([]);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [levelUpTopic, setLevelUpTopic] = useState(null);

    // Generate roadmap when concepts change
    useEffect(() => {
        if (concepts && concepts.length > 0) {
            const result = AdaptiveEngine.generateLearningRoadmap(concepts, 3);
            setRoadmap(result);

            // Check for newly unlocked paths
            result.recommendations.forEach((rec, index) => {
                const isUnlocked = AdaptiveEngine.arePrerequisitesMet(rec.name, concepts.map(c => c.name));
                if (isUnlocked && !unlockedPaths.includes(rec.id)) {
                    setTimeout(() => {
                        setUnlockedPaths(prev => [...prev, rec.id]);
                        playUnlockSound();
                    }, index * 300);
                }

                // Check for mastered paths
                if (rec.currentMastery >= 90 && !masteredPaths.includes(rec.id)) {
                    setTimeout(() => {
                        setMasteredPaths(prev => [...prev, rec.id]);
                        triggerLevelUp(rec.name);
                    }, index * 300 + 500);
                }
            });
        } else {
            // Default roadmap for new users
            const defaultResult = AdaptiveEngine.generateLearningRoadmap([], 3);
            setRoadmap(defaultResult);
        }
    }, [concepts]);

    /**
     * Play unlock sound effect
     */
    const playUnlockSound = () => {
        try {
            // Create a subtle unlock sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    };

    /**
     * Play level up sound effect
     */
    const playLevelUpSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create a cheerful ascending tone
            const frequencies = [523.25, 659.25, 783.99]; // C, E, G (major chord)

            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const startTime = audioContext.currentTime + (index * 0.1);
                gainNode.gain.setValueAtTime(0.15, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    };

    /**
     * Trigger level up animation
     */
    const triggerLevelUp = (topicName) => {
        setLevelUpTopic(topicName);
        setShowLevelUp(true);
        playLevelUpSound();

        setTimeout(() => {
            setShowLevelUp(false);
            setLevelUpTopic(null);
        }, 3000);
    };

    /**
     * Handle topic click
     */
    const handleTopicClick = (topic) => {
        if (onTopicClick) {
            onTopicClick(topic);
        }
    };

    /**
     * Get progress color based on mastery
     */
    const getProgressColor = (mastery) => {
        if (mastery >= 90) return 'var(--color-success)';
        if (mastery >= 75) return 'var(--color-indigo)';
        if (mastery >= 50) return 'var(--color-info)';
        if (mastery >= 25) return 'var(--color-warning)';
        return 'var(--color-gray-400)';
    };

    /**
     * Get difficulty badge color
     */
    const getDifficultyColor = (difficulty) => {
        const colors = {
            1: 'var(--color-success)',
            2: 'var(--color-info)',
            3: 'var(--color-warning)',
            4: 'var(--color-error)'
        };
        return colors[difficulty] || 'var(--color-gray-400)';
    };

    if (!roadmap || !roadmap.recommendations || roadmap.recommendations.length === 0) {
        return (
            <div className={`learning-roadmap ${className}`}>
                <div className="roadmap-header">
                    <TrendingUp size={24} aria-hidden="true" />
                    <h2>Your Learning Roadmap</h2>
                </div>
                <motion.div
                    className="roadmap-empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Sparkles size={48} className="empty-icon" aria-hidden="true" />
                    <h3>Start Your Learning Journey!</h3>
                    <p>Chat with Eco-Mind to discover new topics and build your personalized learning path.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`learning-roadmap ${className}`}>
            {/* Header */}
            <div className="roadmap-header">
                <TrendingUp size={24} aria-hidden="true" />
                <h2 id="roadmap-heading">Your Learning Roadmap</h2>
                <span className="roadmap-subtitle">
                    Personalized recommendations based on your progress
                </span>
            </div>

            {/* Recommendations */}
            <div
                className="roadmap-grid"
                role="list"
                aria-labelledby="roadmap-heading"
            >
                {roadmap.recommendations.map((topic, index) => {
                    const isUnlocked = unlockedPaths.includes(topic.id);
                    const isMastered = masteredPaths.includes(topic.id);
                    const isLocked = topic.prerequisites.length > 0 && !isUnlocked;

                    return (
                        <motion.div
                            key={topic.id}
                            className={`roadmap-card ${isLocked ? 'locked' : ''} ${isMastered ? 'mastered' : ''}`}
                            role="listitem"
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                                delay: index * 0.15
                            }}
                            whileHover={{
                                scale: isLocked ? 1 : 1.02,
                                boxShadow: isLocked ? undefined : '0 20px 40px rgba(0, 0, 0, 0.15)'
                            }}
                            onClick={() => !isLocked && handleTopicClick(topic)}
                            tabIndex={isLocked ? -1 : 0}
                            onKeyPress={(e) => {
                                if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    handleTopicClick(topic);
                                }
                            }}
                            aria-label={`${topic.name} - ${topic.reason}. ${isLocked ? 'Locked. Complete prerequisites first.' : ''}`}
                        >
                            {/* Lock/Unlock Animation */}
                            <AnimatePresence>
                                {isLocked && (
                                    <motion.div
                                        className="lock-overlay"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Lock size={32} aria-hidden="true" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Unlock Animation */}
                            <AnimatePresence>
                                {isUnlocked && !isLocked && (
                                    <motion.div
                                        className="unlock-animation"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: [0, 1.5, 1], rotate: 0 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                    >
                                        <Unlock size={40} className="unlock-icon" aria-hidden="true" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Mastery Flash */}
                            <AnimatePresence>
                                {isMastered && (
                                    <motion.div
                                        className="mastery-flash"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: [0, 1, 1, 0],
                                            scale: [0, 1.2, 1.2, 1.5]
                                        }}
                                        transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Card Content */}
                            <div className="roadmap-card-header">
                                <div className="topic-icon" aria-hidden="true">
                                    {topic.icon}
                                </div>
                                <div className="topic-info">
                                    <h3 className="topic-name">{topic.name}</h3>
                                    <div className="topic-meta">
                                        <span
                                            className="difficulty-badge"
                                            style={{ backgroundColor: getDifficultyColor(topic.difficulty) }}
                                            aria-label={`Difficulty: ${AdaptiveEngine.getDifficultyLabel(topic.difficulty)}`}
                                        >
                                            {AdaptiveEngine.getDifficultyLabel(topic.difficulty)}
                                        </span>
                                        <span className="category-badge" aria-label={`Category: ${topic.category}`}>
                                            {topic.category}
                                        </span>
                                    </div>
                                </div>
                                {isMastered && (
                                    <motion.div
                                        className="mastered-badge"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <CheckCircle size={24} aria-label="Mastered" />
                                    </motion.div>
                                )}
                            </div>

                            <p className="topic-reason">{topic.reason}</p>

                            {/* Progress Bar */}
                            {!topic.isNew && (
                                <div className="progress-section">
                                    <div className="progress-header">
                                        <span className="progress-label">
                                            Progress: {AdaptiveEngine.getMasteryLabel(topic.currentMastery)}
                                        </span>
                                        <span className="progress-value" aria-label={`${topic.currentMastery}% complete`}>
                                            {topic.currentMastery}%
                                        </span>
                                    </div>
                                    <div className="progress-bar" role="progressbar" aria-valuenow={topic.currentMastery} aria-valuemin="0" aria-valuemax="100">
                                        <motion.div
                                            className="progress-fill"
                                            style={{ backgroundColor: getProgressColor(topic.currentMastery) }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${topic.currentMastery}%` }}
                                            transition={{ duration: 1, delay: index * 0.15 + 0.3, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Topic Details */}
                            <div className="topic-details">
                                <div className="detail-item">
                                    <Clock size={16} aria-hidden="true" />
                                    <span>{topic.estimatedTime}</span>
                                </div>
                                {topic.prerequisites.length > 0 && (
                                    <div className="detail-item">
                                        <Target size={16} aria-hidden="true" />
                                        <span>Requires: {topic.prerequisites.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Hint */}
                            {!isLocked && (
                                <div className="action-hint" aria-hidden="true">
                                    Click to start learning →
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Level Up Notification */}
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div
                        className="level-up-notification"
                        initial={{ opacity: 0, y: -50, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        role="alert"
                        aria-live="assertive"
                    >
                        <motion.div
                            className="level-up-icon"
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
                        >
                            <Sparkles size={32} />
                        </motion.div>
                        <div className="level-up-content">
                            <h3>🎉 Mastery Achieved!</h3>
                            <p>You've mastered <strong>{levelUpTopic}</strong>!</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Summary */}
            {roadmap.analysis && (
                <motion.div
                    className="roadmap-summary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="summary-stat">
                        <span className="stat-label">Total Concepts</span>
                        <span className="stat-value">{roadmap.analysis.totalConcepts}</span>
                    </div>
                    <div className="summary-stat">
                        <span className="stat-label">Mastered</span>
                        <span className="stat-value">{roadmap.analysis.masteredConcepts}</span>
                    </div>
                    <div className="summary-stat">
                        <span className="stat-label">Average Mastery</span>
                        <span className="stat-value">{Math.round(roadmap.analysis.averageMastery)}%</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LearningRoadmap;
