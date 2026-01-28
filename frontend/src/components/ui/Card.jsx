import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card Component - Story 3.2
 * Professional, flexible card with multiple elevations and variants
 * Uses design system tokens exclusively
 */
const Card = ({
    children,
    hover = false,
    elevation = 'md',
    className = '',
    header = null,
    footer = null,
    variant = 'default',
    onClick,
    ...props
}) => {
    // Elevation classes
    const elevationClasses = {
        sm: 'card-elevation-sm',
        md: 'card-elevation-md',
        lg: 'card-elevation-lg'
    };

    // Variant classes
    const variantClasses = {
        default: 'card',
        glass: 'glass-panel',
        bordered: 'card-bordered',
        flat: 'card-flat'
    };

    // Combine classes
    const cardClass = `${variantClasses[variant]} ${elevationClasses[elevation]} ${hover ? 'card-hover' : ''} ${className}`.trim();

    // Determine if card should be interactive
    const isInteractive = onClick || hover;

    const CardContent = (
        <>
            {header && (
                <div className="card-header">
                    {header}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </>
    );

    // If interactive, wrap in motion.div
    if (isInteractive) {
        return (
            <motion.div
                className={cardClass}
                onClick={onClick}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick ? 0 : undefined}
                onKeyDown={onClick ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick(e);
                    }
                } : undefined}
                whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' } : {}}
                transition={{ duration: 0.2 }}
                {...props}
            >
                {CardContent}
            </motion.div>
        );
    }

    // Static card
    return (
        <div className={cardClass} {...props}>
            {CardContent}
        </div>
    );
};

// Specialized Card variants for common use cases

/**
 * Feature Card - For showcasing features on homepage
 */
export const FeatureCard = ({ icon, title, description, onClick, color, delay = 0 }) => {
    return (
        <motion.div
            className="card feature-card"
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
            style={{ borderTopColor: color }}
        >
            <div className="feature-card-icon" style={{ color }}>
                {icon}
            </div>
            <h3 className="feature-card-title">{title}</h3>
            <p className="feature-card-description">{description}</p>
        </motion.div>
    );
};

/**
 * Stat Card - For displaying statistics
 */
export const StatCard = ({ icon, label, value, loading = false }) => {
    return (
        <div className="stat-card" role="listitem" aria-label={`${label}: ${loading ? 'loading' : value}`}>
            <div className="stat-icon" aria-hidden="true">{icon}</div>
            <div className="stat-value" aria-live="polite">
                {loading ? '...' : value}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

/**
 * Message Card - For chat messages
 */
export const MessageCard = ({ message, sender, type, delay = 0 }) => {
    const getMessageClass = () => {
        if (sender === 'notification') {
            if (type === 'badge') return 'message message-notification badge';
            if (type === 'challenge') return 'message message-notification challenge';
            return 'message message-notification';
        }
        return sender === 'user' ? 'message message-user' : 'message message-bot';
    };

    const getSenderLabel = () => {
        if (sender === 'user') return 'You';
        if (sender === 'bot') return 'AI mentor';
        return 'Notification';
    };

    return (
        <motion.div
            className={getMessageClass()}
            role="article"
            aria-label={`${getSenderLabel()}: ${message}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            {message}
        </motion.div>
    );
};

export default Card;
