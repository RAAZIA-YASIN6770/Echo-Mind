import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const TreePage = () => {
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
        if (health >= 80) return '#00cc00';
        if (health >= 60) return '#66cc66';
        if (health >= 40) return '#ffcc00';
        if (health >= 20) return '#ff9900';
        return '#ff6666';
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center' }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌳</div>
                    <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>Loading your Knowledge Tree...</div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem' }}>
            <h1 className="text-center">My Knowledge Forest 🌲</h1>

            {/* Tree Stats Header */}
            <motion.div
                className="glass-panel"
                style={{ padding: '2rem', marginTop: '2rem', marginBottom: '2rem' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            {getTreeStateEmoji(treeData?.state)}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {treeData?.state?.replace('_', ' ').toUpperCase() || 'SEEDLING'}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Tree Stage</div>
                    </div>

                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem', color: getHealthColor(treeData?.health_score || 0) }}>
                            {treeData?.health_score || 0}%
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            Health Score
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                            {treeData?.is_wilted ? '⚠️ Needs attention!' : '✅ Healthy'}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            {treeData?.nodes?.length || 0}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            Total Concepts
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                            {treeData?.nodes?.filter(n => n.mastered).length || 0} Mastered
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tree Visualization */}
            <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '2rem', position: 'relative', overflow: 'hidden', minHeight: '600px' }}>
                {/* Background decorations */}
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '20%', background: '#86EFAC', opacity: 0.3, borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}></div>

                {/* SVG Tree */}
                <svg width="100%" height="600" viewBox="-400 -400 800 800" style={{ position: 'relative', zIndex: 10 }}>
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

                    {/* ... (existing nodes mapping) */}
                    {treeData?.nodes?.map((node, index) => (
                        <g key={node.concept_id} onClick={() => setSelectedNode(node)} style={{ cursor: 'pointer' }}>
                            <motion.circle
                                cx={node.position_x || 0}
                                cy={node.position_y || 0}
                                r="15"
                                fill={node.mastered ? '#10B981' : '#E5E7EB'}
                                stroke={node.mastered ? '#059669' : '#D1D5DB'}
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
                                    textAnchor="middle" dy="0.3em" fontSize="12" fill="white" fontWeight="bold"
                                >
                                    ✓
                                </text>
                            )}
                        </g>
                    ))}

                    {/* Main tree icon */}
                    <motion.text
                        x="0" y="0" fontSize="150" textAnchor="middle" dy="0.3em"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: 'spring' }}
                    >
                        {getTreeStateEmoji(treeData?.state)}
                    </motion.text>
                </svg>

                {/* Legend */}
                {/* ... existing legend ... */}
            </div>

            {/* Badges Section */}
            {badges.length > 0 && (
                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem', marginTop: '3rem' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🏆</span> Hall of Achievements
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {badges.map((badge) => (
                            <motion.div
                                key={badge.key}
                                className="card"
                                style={{
                                    padding: '1.5rem',
                                    background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                                    border: '2px solid #FDE68A',
                                    textAlign: 'center'
                                }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏅</div>
                                <h4 style={{ color: '#92400E', marginBottom: '0.5rem' }}>{badge.title}</h4>
                                <p style={{ color: '#B45309', fontSize: '0.9rem', margin: 0 }}>{badge.description}</p>
                                <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: '#D97706', fontWeight: 'bold' }}>
                                    Earned on: {new Date(badge.earned_at).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Selected Node Details */}
            {selectedNode && (
                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem', marginTop: '2rem' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem' }}>{selectedNode.title}</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                    <strong>Status:</strong> {selectedNode.mastered ? '✅ Mastered' : '📚 Learning'}
                                </div>
                                <div>
                                    <strong>Confidence:</strong> {Math.round(selectedNode.mastery_confidence * 100)}%
                                </div>
                                {selectedNode.last_practiced && (
                                    <div>
                                        <strong>Last Practiced:</strong> {new Date(selectedNode.last_practiced).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedNode(null)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: 'var(--color-text-secondary)'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {(!treeData?.nodes || treeData.nodes.length === 0) && (
                <motion.div
                    className="glass-panel"
                    style={{ padding: '3rem', marginTop: '2rem', textAlign: 'center' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
                    <h3 style={{ marginBottom: '1rem' }}>Your tree is just starting!</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                        Start chatting with EchoMind to grow your first concepts.
                    </p>
                    <a href="/chat" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-primary">Start Learning</button>
                    </a>
                </motion.div>
            )}
        </div>
    );
};

export default TreePage;
