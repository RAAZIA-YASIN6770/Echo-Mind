import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { StatCard } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

/**
 * TreePage - Story 3.2 Refactored
 * Uses Card and Button components
 * Fully responsive, dark mode support, micro-interactions
 */
const TreePage = () => {
    const navigate = useNavigate();
    const [treeData, setTreeData] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [treeRes, badgesRes] = await Promise.all([
                api.get('/gamification/tree/state/'),
                api.get('/gamification/achievements/badges/')
            ]);
            setTreeData(treeRes.data.data);
            setBadges(badgesRes.data.badges || []);
        } catch (error) {
            console.error('Error fetching tree data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTreeStateEmoji = (state) => {
        const states = {
            'seedling': '🌱',
            'sapling': '🌿',
            'young_tree': '🌳',
            'mature_tree': '🌲'
        };
        return states[state] || '🌱';
    };

    const getHealthColor = (health) => {
        if (health >= 80) return 'var(--color-success)';
        if (health >= 60) return '#66cc66';
        if (health >= 40) return 'var(--color-warning)';
        if (health >= 20) return '#ff9900';
        return 'var(--color-error)';
    };

    if (loading) {
        return (
            <div className="container loading-container">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="loading-content"
                >
                    <div className="loading-icon">🌳</div>
                    <div className="loading-text">Loading your Knowledge Tree...</div>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="container tree-page">
            <h1 className="hero-title" style={{ textAlign: 'center' }}>
                My Knowledge Forest 🌲
            </h1>

            {/* Tree Stats Header - Story 3.2: Using StatCard */}
            <Card elevation="md" className="tree-stats-card">
                <motion.div
                    className="stats-grid"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <StatCard
                        icon={getTreeStateEmoji(treeData?.state)}
                        label="Tree Stage"
                        value={treeData?.state?.replace('_', ' ').toUpperCase() || 'SEEDLING'}
                    />
                    <StatCard
                        icon="💚"
                        label="Health Score"
                        value={`${treeData?.health_score || 0}%`}
                    />
                    <StatCard
                        icon="🌱"
                        label="Total Concepts"
                        value={treeData?.nodes?.length || 0}
                    />
                    <StatCard
                        icon="✅"
                        label="Mastered"
                        value={treeData?.nodes?.filter(n => n.mastered).length || 0}
                    />
                </motion.div>
            </Card>

            {/* Tree Visualization - Story 3.2: Using Card component */}
            <Card elevation="lg" className="tree-visualization-card">
                {/* Background decorations */}
                <div className="tree-ground"></div>

                {/* SVG Tree */}
                <svg width="100%" height="600" viewBox="-400 -400 800 800" className="tree-svg">
                    {/* Sky/Achievement Stars */}
                    {badges.map((badge, i) => (
                        <motion.g
                            key={badge.key}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <circle
                                cx={-300 + (i % 3) * 100 + (i > 2 ? 50 : 0)}
                                cy={-300 + Math.floor(i / 3) * 80}
                                r="25"
                                fill="url(#badgeGradient)"
                                style={{ filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))' }}
                            />
                            <text
                                x={-300 + (i % 3) * 100 + (i > 2 ? 50 : 0)}
                                y={-300 + Math.floor(i / 3) * 80}
                                textAnchor="middle"
                                dy="0.3em"
                                fontSize="20"
                            >
                                🏆
                            </text>
                            <text
                                x={-300 + (i % 3) * 100 + (i > 2 ? 50 : 0)}
                                y={-300 + Math.floor(i / 3) * 80 + 40}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#D97706"
                                fontWeight="bold"
                            >
                                {badge.title}
                            </text>
                        </motion.g>
                    ))}

                    <defs>
                        <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FDE68A" />
                            <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                    </defs>

                    {/* Tree trunk */}
                    <rect x="-30" y="250" width="60" height="150" fill="#8B4513" rx="10" />

                    {/* Tree nodes */}
                    {treeData?.nodes?.map((node, index) => (
                        <g key={node.concept_id} onClick={() => setSelectedNode(node)} style={{ cursor: 'pointer' }}>
                            <motion.circle
                                cx={node.position_x || 0}
                                cy={node.position_y || 0}
                                r="15"
                                fill={node.mastered ? 'var(--color-success)' : 'var(--color-gray-200)'}
                                stroke={node.mastered ? '#059669' : 'var(--color-gray-300)'}
                                strokeWidth="2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05, type: 'spring' }}
                                whileHover={{ scale: 1.3 }}
                            />
                            {node.mastered && (
                                <text
                                    x={node.position_x || 0}
                                    y={node.position_y || 0}
                                    textAnchor="middle"
                                    dy="0.3em"
                                    fontSize="12"
                                    fill="white"
                                    fontWeight="bold"
                                >
                                    ✓
                                </text>
                            )}
                        </g>
                    ))}

                    {/* Main tree icon */}
                    <motion.text
                        x="0"
                        y="0"
                        fontSize="150"
                        textAnchor="middle"
                        dy="0.3em"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: 'spring' }}
                    >
                        {getTreeStateEmoji(treeData?.state)}
                    </motion.text>
                </svg>
            </Card>

            {/* Badges Section - Story 3.2: Using Card component */}
            {badges.length > 0 && (
                <Card elevation="md" className="badges-section">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2.5rem', marginRight: '1rem' }}>🏆</span>
                            Hall of Achievements
                        </h2>
                        <div className="badges-grid">
                            {badges.map((badge, index) => (
                                <Card
                                    key={badge.key}
                                    hover={true}
                                    elevation="sm"
                                    className="badge-card"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="badge-content"
                                    >
                                        <div className="badge-icon">🏅</div>
                                        <h4 className="badge-title">{badge.title}</h4>
                                        <p className="badge-description">{badge.description}</p>
                                        <div className="badge-date">
                                            Earned on: {new Date(badge.earned_at).toLocaleDateString()}
                                        </div>
                                    </motion.div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </Card>
            )}

            {/* Selected Node Details - Story 3.2: Using Card component */}
            {selectedNode && (
                <Card elevation="lg" className="node-details-card">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="node-details"
                    >
                        <div className="node-header">
                            <div>
                                <h3 className="node-title">{selectedNode.title}</h3>
                                <div className="node-stats">
                                    <div className="node-stat">
                                        <strong>Status:</strong> {selectedNode.mastered ? '✅ Mastered' : '📚 Learning'}
                                    </div>
                                    <div className="node-stat">
                                        <strong>Confidence:</strong> {Math.round(selectedNode.mastery_confidence * 100)}%
                                    </div>
                                    {selectedNode.last_practiced && (
                                        <div className="node-stat">
                                            <strong>Last Practiced:</strong> {new Date(selectedNode.last_practiced).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="close-button"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                </Card>
            )}

            {/* Empty State - Story 3.2: Using Card and Button components */}
            {(!treeData?.nodes || treeData.nodes.length === 0) && (
                <Card elevation="md" className="empty-state-card">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="empty-state"
                    >
                        <div className="empty-icon">🌱</div>
                        <h3 className="empty-title">Your tree is just starting!</h3>
                        <p className="empty-description">
                            Start chatting with EchoMind to grow your first concepts.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/chat')}
                        >
                            Start Learning
                        </Button>
                    </motion.div>
                </Card>
            )}
        </main>
    );
};

export default TreePage;
