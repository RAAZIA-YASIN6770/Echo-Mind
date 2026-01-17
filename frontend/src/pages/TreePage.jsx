import React from 'react';
import { motion } from 'framer-motion';

const TreePage = () => {
    return (
        <div className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-center">My Knowledge Forest 🌲</h1>

            <div className="card glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem', position: 'relative', overflow: 'hidden' }}>
                {/* Background decorations */}
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '20%', background: '#86EFAC', opacity: 0.3, borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}></div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    style={{ fontSize: '10rem', position: 'relative', zIndex: 10 }}
                >
                    🌳
                </motion.div>

                <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
                    <h4 style={{ margin: 0 }}>Statistics</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                        <span>Healthy</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent)' }}></span>
                        <span>Growing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreePage;
