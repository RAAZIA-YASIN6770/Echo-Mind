/**
 * AdaptiveEngine.js - Story 3.3: Adaptive Learning Paths
 * 
 * Analyzes user's mastery levels from Mind Map and generates personalized
 * learning recommendations based on current progress and weak areas.
 * 
 * @module AdaptiveEngine
 */

/**
 * Knowledge Graph - Defines relationships between concepts
 * Each concept has prerequisites and related topics
 */
const KNOWLEDGE_GRAPH = {
    // Mathematics
    'Math': {
        prerequisites: [],
        relatedTopics: ['Algebra', 'Geometry', 'Calculus'],
        difficulty: 1,
        category: 'Mathematics'
    },
    'Algebra': {
        prerequisites: ['Math'],
        relatedTopics: ['Geometry', 'Calculus', 'Statistics'],
        difficulty: 2,
        category: 'Mathematics'
    },
    'Geometry': {
        prerequisites: ['Math'],
        relatedTopics: ['Algebra', 'Trigonometry'],
        difficulty: 2,
        category: 'Mathematics'
    },
    'Calculus': {
        prerequisites: ['Algebra', 'Geometry'],
        relatedTopics: ['Physics', 'Statistics'],
        difficulty: 3,
        category: 'Mathematics'
    },
    'Statistics': {
        prerequisites: ['Algebra'],
        relatedTopics: ['Probability', 'Data Science'],
        difficulty: 3,
        category: 'Mathematics'
    },

    // Sciences
    'Science': {
        prerequisites: [],
        relatedTopics: ['Physics', 'Chemistry', 'Biology'],
        difficulty: 1,
        category: 'Science'
    },
    'Physics': {
        prerequisites: ['Science', 'Math'],
        relatedTopics: ['Chemistry', 'Calculus', 'Engineering'],
        difficulty: 3,
        category: 'Science'
    },
    'Chemistry': {
        prerequisites: ['Science', 'Math'],
        relatedTopics: ['Physics', 'Biology', 'Organic Chemistry'],
        difficulty: 3,
        category: 'Science'
    },
    'Biology': {
        prerequisites: ['Science'],
        relatedTopics: ['Chemistry', 'Anatomy', 'Ecology'],
        difficulty: 2,
        category: 'Science'
    },

    // Computer Science
    'Programming': {
        prerequisites: ['Math'],
        relatedTopics: ['Coding', 'Computer', 'Algorithms'],
        difficulty: 2,
        category: 'Computer Science'
    },
    'Coding': {
        prerequisites: ['Programming'],
        relatedTopics: ['Algorithms', 'Data Structures'],
        difficulty: 2,
        category: 'Computer Science'
    },
    'Computer': {
        prerequisites: [],
        relatedTopics: ['Programming', 'Technology'],
        difficulty: 1,
        category: 'Computer Science'
    },
    'Technology': {
        prerequisites: [],
        relatedTopics: ['Computer', 'Engineering', 'Programming'],
        difficulty: 1,
        category: 'Computer Science'
    },

    // Humanities
    'History': {
        prerequisites: [],
        relatedTopics: ['Geography', 'Literature', 'Art'],
        difficulty: 1,
        category: 'Humanities'
    },
    'Geography': {
        prerequisites: [],
        relatedTopics: ['History', 'Science'],
        difficulty: 1,
        category: 'Humanities'
    },
    'Literature': {
        prerequisites: [],
        relatedTopics: ['History', 'Art', 'Writing'],
        difficulty: 2,
        category: 'Humanities'
    },
    'Art': {
        prerequisites: [],
        relatedTopics: ['History', 'Literature', 'Music'],
        difficulty: 1,
        category: 'Arts'
    },
    'Music': {
        prerequisites: [],
        relatedTopics: ['Art', 'Math'],
        difficulty: 1,
        category: 'Arts'
    },

    // Engineering
    'Engineering': {
        prerequisites: ['Math', 'Physics'],
        relatedTopics: ['Technology', 'Computer'],
        difficulty: 4,
        category: 'Engineering'
    }
};

/**
 * Mastery Level Thresholds
 */
const MASTERY_THRESHOLDS = {
    BEGINNER: 0,
    LEARNING: 25,
    INTERMEDIATE: 50,
    ADVANCED: 75,
    MASTERED: 90
};

/**
 * AdaptiveEngine Class
 * Analyzes user progress and generates personalized learning paths
 */
class AdaptiveEngine {
    /**
     * Analyze user's current concepts and mastery levels
     * @param {Array} concepts - Array of concept objects with mastery levels
     * @returns {Object} Analysis results
     */
    static analyzeProgress(concepts) {
        if (!concepts || concepts.length === 0) {
            return {
                totalConcepts: 0,
                masteredConcepts: 0,
                weakAreas: [],
                strongAreas: [],
                averageMastery: 0,
                categories: {}
            };
        }

        const totalConcepts = concepts.length;
        const masteredConcepts = concepts.filter(c => c.masteryLevel >= MASTERY_THRESHOLDS.MASTERED).length;
        const weakAreas = concepts.filter(c => c.masteryLevel < MASTERY_THRESHOLDS.INTERMEDIATE);
        const strongAreas = concepts.filter(c => c.masteryLevel >= MASTERY_THRESHOLDS.ADVANCED);

        const averageMastery = concepts.reduce((sum, c) => sum + (c.masteryLevel || 0), 0) / totalConcepts;

        // Categorize concepts
        const categories = {};
        concepts.forEach(concept => {
            const category = KNOWLEDGE_GRAPH[concept.name]?.category || 'Other';
            if (!categories[category]) {
                categories[category] = {
                    count: 0,
                    totalMastery: 0,
                    concepts: []
                };
            }
            categories[category].count++;
            categories[category].totalMastery += concept.masteryLevel || 0;
            categories[category].concepts.push(concept);
        });

        // Calculate average mastery per category
        Object.keys(categories).forEach(cat => {
            categories[cat].averageMastery = categories[cat].totalMastery / categories[cat].count;
        });

        return {
            totalConcepts,
            masteredConcepts,
            weakAreas,
            strongAreas,
            averageMastery,
            categories
        };
    }

    /**
     * Check if prerequisites are met for a topic
     * @param {string} topic - Topic name
     * @param {Array} learnedConcepts - Array of learned concept names
     * @returns {boolean} True if prerequisites are met
     */
    static arePrerequisitesMet(topic, learnedConcepts) {
        const topicInfo = KNOWLEDGE_GRAPH[topic];
        if (!topicInfo || !topicInfo.prerequisites || topicInfo.prerequisites.length === 0) {
            return true; // No prerequisites
        }

        return topicInfo.prerequisites.every(prereq =>
            learnedConcepts.includes(prereq)
        );
    }

    /**
     * Calculate priority score for a topic
     * @param {string} topic - Topic name
     * @param {Array} concepts - User's current concepts
     * @param {Object} analysis - Progress analysis
     * @returns {number} Priority score (higher = more recommended)
     */
    static calculatePriorityScore(topic, concepts, analysis) {
        let score = 0;
        const topicInfo = KNOWLEDGE_GRAPH[topic];

        if (!topicInfo) return 0;

        // Already learned? Lower priority
        const existingConcept = concepts.find(c => c.name === topic);
        if (existingConcept) {
            // If mastery is low, increase priority to revisit
            if (existingConcept.masteryLevel < MASTERY_THRESHOLDS.INTERMEDIATE) {
                score += 50; // High priority to improve weak areas
            } else if (existingConcept.masteryLevel < MASTERY_THRESHOLDS.MASTERED) {
                score += 20; // Medium priority to master
            } else {
                return 0; // Already mastered, skip
            }
        } else {
            score += 30; // New topic, good priority
        }

        // Prerequisites met? Higher priority
        const learnedConcepts = concepts.map(c => c.name);
        if (this.arePrerequisitesMet(topic, learnedConcepts)) {
            score += 40;
        } else {
            score -= 30; // Prerequisites not met, lower priority
        }

        // Related to weak areas? Higher priority
        const weakAreaNames = analysis.weakAreas.map(c => c.name);
        const relatedToWeakArea = topicInfo.relatedTopics.some(t => weakAreaNames.includes(t));
        if (relatedToWeakArea) {
            score += 25;
        }

        // Related to strong areas? Medium priority (build on strengths)
        const strongAreaNames = analysis.strongAreas.map(c => c.name);
        const relatedToStrongArea = topicInfo.relatedTopics.some(t => strongAreaNames.includes(t));
        if (relatedToStrongArea) {
            score += 15;
        }

        // Difficulty appropriate? (prefer slightly challenging)
        const userLevel = Math.floor(analysis.averageMastery / 25); // 0-4
        const difficultyDiff = Math.abs(topicInfo.difficulty - userLevel);
        if (difficultyDiff === 1) {
            score += 20; // Perfect challenge level
        } else if (difficultyDiff === 0) {
            score += 10; // Same level, okay
        } else if (difficultyDiff > 2) {
            score -= 15; // Too hard or too easy
        }

        return score;
    }

    /**
     * Generate personalized learning roadmap
     * @param {Array} concepts - User's current concepts with mastery levels
     * @param {number} count - Number of recommendations (default: 3)
     * @returns {Array} Recommended topics with metadata
     */
    static generateLearningRoadmap(concepts = [], count = 3) {
        // Analyze current progress
        const analysis = this.analyzeProgress(concepts);

        // Get all possible topics
        const allTopics = Object.keys(KNOWLEDGE_GRAPH);
        const learnedTopics = concepts.map(c => c.name);

        // Calculate priority scores for all topics
        const scoredTopics = allTopics.map(topic => ({
            name: topic,
            score: this.calculatePriorityScore(topic, concepts, analysis),
            info: KNOWLEDGE_GRAPH[topic],
            isNew: !learnedTopics.includes(topic),
            currentMastery: concepts.find(c => c.name === topic)?.masteryLevel || 0
        }));

        // Sort by priority score (descending)
        scoredTopics.sort((a, b) => b.score - a.score);

        // Get top recommendations
        const recommendations = scoredTopics
            .filter(t => t.score > 0) // Only positive scores
            .slice(0, count)
            .map((topic, index) => ({
                id: `roadmap-${index}`,
                name: topic.name,
                category: topic.info.category,
                difficulty: topic.info.difficulty,
                prerequisites: topic.info.prerequisites,
                relatedTopics: topic.info.relatedTopics,
                isNew: topic.isNew,
                currentMastery: topic.currentMastery,
                priorityScore: topic.score,
                reason: this.getRecommendationReason(topic, analysis),
                estimatedTime: this.estimateStudyTime(topic.info.difficulty),
                icon: this.getCategoryIcon(topic.info.category)
            }));

        return {
            recommendations,
            analysis,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Get human-readable reason for recommendation
     * @param {Object} topic - Topic object
     * @param {Object} analysis - Progress analysis
     * @returns {string} Recommendation reason
     */
    static getRecommendationReason(topic, analysis) {
        if (!topic.isNew && topic.currentMastery < MASTERY_THRESHOLDS.INTERMEDIATE) {
            return 'Strengthen your foundation in this area';
        }
        if (!topic.isNew && topic.currentMastery < MASTERY_THRESHOLDS.MASTERED) {
            return 'You\'re making progress! Let\'s master this';
        }
        if (topic.info.prerequisites.length > 0) {
            return `Build on your ${topic.info.prerequisites[0]} knowledge`;
        }
        if (topic.info.difficulty <= 2) {
            return 'Great starting point for beginners';
        }
        if (topic.info.difficulty >= 3) {
            return 'Ready for a challenge? This will expand your skills';
        }
        return 'Recommended based on your learning path';
    }

    /**
     * Estimate study time based on difficulty
     * @param {number} difficulty - Difficulty level (1-4)
     * @returns {string} Estimated time
     */
    static estimateStudyTime(difficulty) {
        const times = {
            1: '15-30 min',
            2: '30-45 min',
            3: '45-60 min',
            4: '60+ min'
        };
        return times[difficulty] || '30 min';
    }

    /**
     * Get icon for category
     * @param {string} category - Category name
     * @returns {string} Emoji icon
     */
    static getCategoryIcon(category) {
        const icons = {
            'Mathematics': '🔢',
            'Science': '🔬',
            'Computer Science': '💻',
            'Humanities': '📚',
            'Arts': '🎨',
            'Engineering': '⚙️',
            'Other': '📖'
        };
        return icons[category] || '📖';
    }

    /**
     * Get difficulty label
     * @param {number} difficulty - Difficulty level (1-4)
     * @returns {string} Difficulty label
     */
    static getDifficultyLabel(difficulty) {
        const labels = {
            1: 'Beginner',
            2: 'Intermediate',
            3: 'Advanced',
            4: 'Expert'
        };
        return labels[difficulty] || 'Intermediate';
    }

    /**
     * Get mastery level label
     * @param {number} mastery - Mastery percentage (0-100)
     * @returns {string} Mastery label
     */
    static getMasteryLabel(mastery) {
        if (mastery >= MASTERY_THRESHOLDS.MASTERED) return 'Mastered';
        if (mastery >= MASTERY_THRESHOLDS.ADVANCED) return 'Advanced';
        if (mastery >= MASTERY_THRESHOLDS.INTERMEDIATE) return 'Intermediate';
        if (mastery >= MASTERY_THRESHOLDS.LEARNING) return 'Learning';
        return 'Beginner';
    }
}

export default AdaptiveEngine;
export { KNOWLEDGE_GRAPH, MASTERY_THRESHOLDS };
