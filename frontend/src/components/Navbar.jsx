import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Sprout, Award, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/tree', icon: Sprout, label: 'My Tree' },
        { path: '/achievements', icon: Award, label: 'Rewards' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav
            aria-label="Main navigation"
            className="glass-panel"
            style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                zIndex: 100,
                borderRadius: 'var(--radius-full)'
            }}
        >
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            textDecoration: 'none',
                            position: 'relative'
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="nav-pill"
                                style={{
                                    position: 'absolute',
                                    top: -10,
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)',
                                }}
                            />
                        )}
                        <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: isActive ? 700 : 500 }}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}

            {/* Theme Toggle - Story 1.3 */}
            <div style={{
                marginLeft: '1rem',
                paddingLeft: '1rem',
                borderLeft: '1px solid var(--color-divider)'
            }}>
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
