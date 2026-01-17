import React from 'react';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <div className="container" style={{ paddingBottom: '8rem', paddingTop: '4rem' }}>
            <header className="text-center" style={{ marginBottom: '4rem' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                        Welcome back, Explorer! 🚀
                    </h1>
                    <p style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>
                        Ready to grow your mind today?
                    </p>
                </motion.div>
            </header>

            <section className="grid-features" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>

                {/* Feature 1 */}
                <motion.div
                    className="card"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div style={{
                        background: 'var(--color-primary-light)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        marginBottom: '1rem'
                    }}>
                        🌳
                    </div>
                    <h3>Your Knowledge Tree</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--color-text-muted)' }}>
                        Your tree is looking healthy! You've mastered 12 concepts this week.
                    </p>
                    <button className="btn-primary" style={{ width: '100%', fontSize: '1rem' }}>View Tree</button>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                    className="card"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={{
                        background: 'var(--color-accent-light)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        marginBottom: '1rem'
                    }}>
                        🔥
                    </div>
                    <h3>Daily Streak</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--color-text-muted)' }}>
                        You're on a <strong>5 day streak!</strong> Keep it up to earn Golden Leaves.
                    </p>
                    <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '70%', height: '100%', background: 'var(--color-accent)' }}></div>
                    </div>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                    className="card"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div style={{
                        background: '#E0F2FE',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        marginBottom: '1rem'
                    }}>
                        🤖
                    </div>
                    <h3>Ask Eco-Mind</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--color-text-muted)' }}>
                        Stuck on a question? I'm here to help you think through it!
                    </p>
                    <button className="btn-primary" style={{ width: '100%', fontSize: '1rem', background: '#0284C7' }}>Start Chat</button>
                </motion.div>

            </section>
        </div>
    );
};

export default HomePage;
