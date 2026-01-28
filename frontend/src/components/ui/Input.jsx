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
                <label
                    htmlFor={inputId}
                    className="input-label"
                >
                    {label}
                    {required && <span className="input-required" aria-label="required">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className={`input-container ${icon ? 'has-icon' : ''} ${iconPosition}`}>
                {/* Icon - Left */}
                {icon && iconPosition === 'left' && (
                    <div className="input-icon input-icon-left" aria-hidden="true">
                        {icon}
                    </div>
                )}

                {/* Input Field */}
                <input
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
                    {...props}
                />

                {/* Icon - Right */}
                {icon && iconPosition === 'right' && (
                    <div className="input-icon input-icon-right" aria-hidden="true">
                        {icon}
                    </div>
                )}

                {/* Success/Error Indicator */}
                {(error || success) && (
                    <div className="input-indicator" aria-hidden="true">
                        {error && <span className="input-error-icon">⚠️</span>}
                        {success && !error && <span className="input-success-icon">✓</span>}
                    </div>
                )}
            </div>

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
