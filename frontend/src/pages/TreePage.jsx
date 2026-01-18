import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const TreePage = () => {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
        fetchTreeData();
    }, []);

    const fetchTreeData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/gamification/tree/state/');
            setTreeData(response.data);
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
                            {getTreeStateEmoji(treeData?.tree_state)}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {treeData?.tree_state?.replace('_', ' ').toUpperCase() || 'SEEDLING'}
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
                            {treeData?.is_wilting ? '⚠️ Needs attention!' : '✅ Healthy'}
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
                    {/* Tree trunk */}
                    <rect x="-30" y="250" width="60" height="150" fill="#8B4513" rx="10" />

                    {/* Nodes */}
                    {treeData?.nodes?.map((node, index) => (
                        <g key={node.concept_id} onClick={() => setSelectedNode(node)} style={{ cursor: 'pointer' }}>
                            <motion.circle
                                cx={node.position_x || 0}
                                cy={node.position_y || 0}
                                r="15"
                                fill={node.mastered ? '#00cc00' : '#cccccc'}
                                stroke={node.mastered ? '#008800' : '#999999'}
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
                    <text x="0" y="0" fontSize="120" textAnchor="middle" dy="0.3em">
                        {getTreeStateEmoji(treeData?.tree_state)}
                    </text>
                </svg>

                {/* Legend */}
                <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Legend</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#00cc00', display: 'inline-block' }}></span>
                        <span>Mastered</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#cccccc', display: 'inline-block' }}></span>
                        <span>Learning</span>
                    </div>
                </div>
            </div>

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
