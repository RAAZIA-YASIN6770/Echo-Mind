import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button Component - Story 3.1
 * Professional, accessible button with multiple variants and states
 * Uses design system tokens exclusively
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon = null,
    iconPosition = 'left',
    onClick,
    type = 'button',
    className = '',
    ariaLabel,
    ...props
}) => {
    // Variant styles
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger'
    };

    // Size styles
    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };

    // Combine classes
    const buttonClass = `btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

    // Handle click
    const handleClick = (e) => {
        if (!disabled && !loading && onClick) {
            onClick(e);
        }
    };

    // Handle keyboard interaction
    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loading && onClick) {
            e.preventDefault();
            onClick(e);
        }
    };

    return (
        <motion.button
            type={type}
            className={buttonClass}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="animate-spin" />
                    {children && <span style={{ marginLeft: 'var(--space-2)' }}>Loading...</span>}
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <span style={{ marginRight: children ? 'var(--space-2)' : 0 }}>
                            {icon}
                        </span>
                    )}
                    {children}
                    {icon && iconPosition === 'right' && (
                        <span style={{ marginLeft: children ? 'var(--space-2)' : 0 }}>
                            {icon}
                        </span>
                    )}
                </>
            )}
        </motion.button>
    );
};

// Additional button variants for specific use cases
export const IconButton = ({
    icon,
    variant = 'primary',
    ariaLabel,
    onClick,
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    const variantClasses = {
        primary: 'icon-btn-primary',
        secondary: 'icon-btn-secondary',
        danger: 'icon-btn-danger',
        success: 'icon-btn-success'
    };

    const buttonClass = `icon-btn ${variantClasses[variant]} ${className}`.trim();

    return (
        <motion.button
            type="button"
            className={buttonClass}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={ariaLabel}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                icon
            )}
        </motion.button>
    );
};

export default Button;
