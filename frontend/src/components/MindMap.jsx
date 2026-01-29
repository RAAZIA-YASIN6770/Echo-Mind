import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { IconButton } from './ui/Button';

/**
 * MindMap Component - Story 3.2: Concept Mind Mapping
 * Interactive visualization of learned concepts as a branching tree
 * Responsive, dark mode support, animated concept additions
 */
const MindMap = ({ concepts = [], onConceptClick }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [selectedConcept, setSelectedConcept] = useState(null);
    const containerRef = useRef(null);

    // Calculate node positions in a radial tree layout
    const calculateNodePositions = () => {
        if (concepts.length === 0) return [];

        const centerX = 400;
        const centerY = 300;
        const radius = 150;
        const angleStep = (2 * Math.PI) / Math.max(concepts.length - 1, 1);

        return concepts.map((concept, index) => {
            if (index === 0) {
                // Root node at center
                return {
                    ...concept,
                    x: centerX,
                    y: centerY,
                    level: 0
                };
            }

            // Arrange other nodes in a circle
            const angle = angleStep * (index - 1);
            const level = Math.floor((index - 1) / 6) + 1;
            const levelRadius = radius * level;

            return {
                ...concept,
                x: centerX + Math.cos(angle) * levelRadius,
                y: centerY + Math.sin(angle) * levelRadius,
                level
            };
        });
    };

    const nodes = calculateNodePositions();

    // Handle zoom
    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 2));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Handle drag
    const handleMouseDown = (e) => {
        if (e.target === containerRef.current || e.target.closest('.mindmap-canvas')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart]);

    // Handle concept click
    const handleNodeClick = (concept) => {
        setSelectedConcept(concept);
        if (onConceptClick) {
            onConceptClick(concept);
        }
    };

    // Get node color based on level
    const getNodeColor = (level) => {
        const colors = [
            'var(--color-indigo)',      // Level 0 (root)
            'var(--color-purple)',       // Level 1
            'var(--color-blue)',         // Level 2
            'var(--color-teal)',         // Level 3
            'var(--color-green)',        // Level 4
        ];
        return colors[Math.min(level, colors.length - 1)];
    };

    return (
        <div className="mindmap-container" ref={containerRef}>
            {/* Controls */}
            <div className="mindmap-controls">
                <IconButton
                    icon={<ZoomIn size={18} />}
                    variant="secondary"
                    ariaLabel="Zoom in"
                    onClick={handleZoomIn}
                />
                <IconButton
                    icon={<ZoomOut size={18} />}
                    variant="secondary"
                    ariaLabel="Zoom out"
                    onClick={handleZoomOut}
                />
                <IconButton
                    icon={<Maximize2 size={18} />}
                    variant="secondary"
                    ariaLabel="Reset view"
                    onClick={handleReset}
                />
            </div>

            {/* Canvas */}
            <motion.div
                className="mindmap-canvas"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
            >
                <svg width="800" height="600" className="mindmap-svg">
                    {/* Draw connections */}
                    {nodes.map((node, index) => {
                        if (index === 0) return null; // Skip root
                        const parent = nodes[0]; // Connect all to root for now
                        return (
                            <motion.line
                                key={`line-${index}`}
                                x1={parent.x}
                                y1={parent.y}
                                x2={node.x}
                                y2={node.y}
                                stroke="var(--color-gray-300)"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.5 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            />
                        );
                    })}

                    {/* Draw nodes */}
                    {nodes.map((node, index) => (
                        <g key={`node-${index}`}>
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r={node.level === 0 ? 40 : 30}
                                fill={getNodeColor(node.level)}
                                stroke={selectedConcept?.id === node.id ? 'var(--color-warning)' : 'transparent'}
                                strokeWidth="4"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                    delay: index * 0.1
                                }}
                                whileHover={{ scale: 1.2 }}
                                onClick={() => handleNodeClick(node)}
                                style={{ cursor: 'pointer' }}
                            />
                            <motion.text
                                x={node.x}
                                y={node.y}
                                textAnchor="middle"
                                dy=".3em"
                                fill="white"
                                fontSize={node.level === 0 ? "14" : "12"}
                                fontWeight="bold"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                                {node.name.length > 12 ? node.name.substring(0, 12) + '...' : node.name}
                            </motion.text>
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* Concept Details Panel */}
            <AnimatePresence>
                {selectedConcept && (
                    <motion.div
                        className="concept-details-panel"
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="panel-header">
                            <h3>{selectedConcept.name}</h3>
                            <button
                                className="close-button"
                                onClick={() => setSelectedConcept(null)}
                                aria-label="Close details"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="panel-content">
                            <p className="concept-description">
                                {selectedConcept.description || 'No description available.'}
                            </p>
                            {selectedConcept.relatedTopics && (
                                <div className="related-topics">
                                    <h4>Related Topics:</h4>
                                    <ul>
                                        {selectedConcept.relatedTopics.map((topic, idx) => (
                                            <li key={idx}>{topic}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedConcept.masteryLevel !== undefined && (
                                <div className="mastery-level">
                                    <h4>Mastery Level:</h4>
                                    <div className="progress-bar">
                                        <motion.div
                                            className="progress-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${selectedConcept.masteryLevel}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <span>{selectedConcept.masteryLevel}%</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {concepts.length === 0 && (
                <motion.div
                    className="mindmap-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="empty-icon">🧠</div>
                    <h3>Your Mind Map is Empty</h3>
                    <p>Start chatting to build your knowledge graph!</p>
                </motion.div>
            )}

            {/* Legend */}
            {concepts.length > 0 && (
                <div className="mindmap-legend">
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: 'var(--color-indigo)' }} />
                        <span>Core Concept</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: 'var(--color-purple)' }} />
                        <span>Related</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: 'var(--color-blue)' }} />
                        <span>Extended</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MindMap;
