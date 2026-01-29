import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Input Component - Story 3.3
 * Professional, accessible input with validation states
 * Uses design system tokens exclusively
 */
const Input = ({
    type = 'text',
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    error = '',
    success = false,
    placeholder = '',
    icon = null,
    iconPosition = 'left',
    disabled = false,
    required = false,
    className = '',
    id,
    name,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Generate unique ID if not provided
    const inputId = id || `input-${name || label?.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;
    const helpId = `${inputId}-help`;

    // Determine input state class
    const getStateClass = () => {
        if (error) return 'error';
        if (success) return 'success';
        return '';
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className={`input-wrapper ${className}`}>
            {/* Label */}
            {label && (
                <motion.label
                    htmlFor={inputId}
                    className="input-label"
                    // Story 2.3: Floating label animation
                    animate={{
                        y: isFocused || value ? -2 : 0,
                        scale: isFocused || value ? 0.95 : 1,
                        color: isFocused ? 'var(--color-indigo)' : 'var(--color-text-secondary)'
                    }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    {label}
                    {required && <span className="input-required" aria-label="required">*</span>}
                </motion.label>
            )}

            {/* Input Container */}
            <motion.div
                className={`input-container ${icon ? 'has-icon' : ''} ${iconPosition}`}
                // Story 2.3: Error shake animation
                animate={error ? {
                    x: [-10, 10, -10, 10, 0],
                } : {}}
                transition={{ duration: 0.4 }}
            >
                {/* Icon - Left */}
                {icon && iconPosition === 'left' && (
                    <div className="input-icon input-icon-left" aria-hidden="true">
                        {icon}
                    </div>
                )}

                {/* Input Field with Focus Glow */}
                <motion.input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    minLength={minLength}
                    pattern={pattern}
                    className={`input-field ${getStateClass()} ${icon ? 'with-icon' : ''} ${iconPosition === 'right' ? 'icon-right' : ''}`}
                    aria-label={label || placeholder}
                    aria-describedby={error ? errorId : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-required={required}
                    // Story 2.3: Focus glow effect
                    animate={{
                        boxShadow: isFocused
                            ? '0 0 0 4px rgba(99, 102, 241, 0.2)'
                            : error
                                ? '0 0 0 2px rgba(239, 68, 68, 0.2)'
                                : success
                                    ? '0 0 0 2px rgba(16, 185, 129, 0.2)'
                                    : '0 0 0 0px transparent',
                        borderColor: isFocused
                            ? 'var(--color-indigo)'
                            : error
                                ? 'var(--color-error)'
                                : success
                                    ? 'var(--color-success)'
                                    : 'var(--color-gray-200)'
                    }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    {...props}
                />

                {/* Icon - Right */}
                {icon && iconPosition === 'right' && (
                    <div className="input-icon input-icon-right" aria-hidden="true">
                        {icon}
                    </div>
                )}

                {/* Success/Error Indicator with Animation */}
                {(error || success) && (
                    <motion.div
                        className="input-indicator"
                        aria-hidden="true"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        {error && <span className="input-error-icon">⚠️</span>}
                        {success && !error && <span className="input-success-icon">✓</span>}
                    </motion.div>
                )}
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    id={errorId}
                    className="input-error-message"
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};

/**
 * Textarea Component - For multi-line input
 */
export const Textarea = ({
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    error = '',
    placeholder = '',
    disabled = false,
    required = false,
    className = '',
    id,
    name,
    rows = 4,
    maxLength,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const textareaId = id || `textarea-${name || label?.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${textareaId}-error`;

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className={`input-wrapper ${className}`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={textareaId}
                    className="input-label"
                >
                    {label}
                    {required && <span className="input-required" aria-label="required">*</span>}
                </label>
            )}

            {/* Textarea */}
            <textarea
                id={textareaId}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                maxLength={maxLength}
                className={`input-field textarea ${error ? 'error' : ''}`}
                aria-label={label || placeholder}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error ? 'true' : 'false'}
                aria-required={required}
                {...props}
            />

            {/* Character Count */}
            {maxLength && (
                <div className="textarea-count" aria-live="polite">
                    {value?.length || 0} / {maxLength}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <motion.div
                    id={errorId}
                    className="input-error-message"
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};

/**
 * SearchInput Component - Input with search icon
 */
export const SearchInput = ({ placeholder = 'Search...', ...props }) => {
    return (
        <Input
            type="search"
            placeholder={placeholder}
            icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            }
            iconPosition="left"
            {...props}
        />
    );
};

export default Input;
