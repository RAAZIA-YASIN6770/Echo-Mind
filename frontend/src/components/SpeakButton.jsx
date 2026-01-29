import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

/**
 * SpeakButton Component - Story 3.1: AI Voice Synthesis
 * Displays speak/pause/stop controls with waveform animation
 * WCAG AAA compliant with keyboard support and ARIA labels
 */
const SpeakButton = ({
    text,
    speaking,
    paused,
    onSpeak,
    onPause,
    onResume,
    onStop,
    className = ''
}) => {
    const handleClick = () => {
        if (speaking && !paused) {
            onPause();
        } else if (speaking && paused) {
            onResume();
        } else {
            onSpeak(text);
        }
    };

    const handleStop = (e) => {
        e.stopPropagation();
        onStop();
    };

    // Waveform animation bars
    const WaveformBar = ({ delay }) => (
        <motion.div
            className="waveform-bar"
            animate={speaking && !paused ? {
                scaleY: [1, 1.5, 0.8, 1.8, 1],
            } : {
                scaleY: 1
            }}
            transition={{
                duration: 0.8,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }}
        />
    );

    return (
        <div className={`speak-button-container ${className}`}>
            {/* Main Speak/Pause Button */}
            <motion.button
                className="speak-button"
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={
                    speaking && !paused
                        ? "Pause speech"
                        : speaking && paused
                            ? "Resume speech"
                            : "Speak message"
                }
                aria-pressed={speaking}
            >
                {speaking && !paused ? (
                    <Pause size={16} />
                ) : speaking && paused ? (
                    <Play size={16} />
                ) : (
                    <Volume2 size={16} />
                )}

                {/* Waveform Animation - Story 3.1 */}
                {speaking && !paused && (
                    <div className="waveform" aria-hidden="true">
                        <WaveformBar delay={0} />
                        <WaveformBar delay={0.1} />
                        <WaveformBar delay={0.2} />
                        <WaveformBar delay={0.3} />
                    </div>
                )}
            </motion.button>

            {/* Stop Button (shown when speaking) */}
            {speaking && (
                <motion.button
                    className="stop-button"
                    onClick={handleStop}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Stop speech"
                >
                    <VolumeX size={16} />
                </motion.button>
            )}
        </div>
    );
};

export default SpeakButton;
