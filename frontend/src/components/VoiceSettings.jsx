import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, Gauge, Music } from 'lucide-react';
import Card from './ui/Card';

/**
 * VoiceSettings Component - Story 3.1: AI Voice Synthesis
 * Allows users to select voice, adjust rate, pitch, and volume
 * WCAG AAA compliant with clear labels and keyboard support
 */
const VoiceSettings = ({
    voices,
    selectedVoice,
    rate,
    pitch,
    volume,
    onVoiceChange,
    onRateChange,
    onPitchChange,
    onVolumeChange,
    onClose
}) => {
    return (
        <Card elevation="lg" className="voice-settings-card">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="voice-settings"
            >
                {/* Header */}
                <div className="voice-settings-header">
                    <div className="header-title">
                        <Settings size={20} />
                        <h3>Voice Settings</h3>
                    </div>
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close voice settings"
                    >
                        ✕
                    </button>
                </div>

                {/* Voice Selection */}
                <div className="voice-setting-group">
                    <label htmlFor="voice-select" className="setting-label">
                        <Volume2 size={16} />
                        Voice
                    </label>
                    <select
                        id="voice-select"
                        className="input-field"
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                            const voice = voices.find(v => v.name === e.target.value);
                            onVoiceChange(voice);
                        }}
                        aria-label="Select voice"
                    >
                        {voices.map((voice) => (
                            <option key={voice.name} value={voice.name}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rate Control */}
                <div className="voice-setting-group">
                    <label htmlFor="rate-slider" className="setting-label">
                        <Gauge size={16} />
                        Speed: {rate.toFixed(1)}x
                    </label>
                    <input
                        id="rate-slider"
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={rate}
                        onChange={(e) => onRateChange(parseFloat(e.target.value))}
                        className="slider"
                        aria-label="Adjust speech rate"
                    />
                    <div className="slider-labels">
                        <span>Slow</span>
                        <span>Normal</span>
                        <span>Fast</span>
                    </div>
                </div>

                {/* Pitch Control */}
                <div className="voice-setting-group">
                    <label htmlFor="pitch-slider" className="setting-label">
                        <Music size={16} />
                        Pitch: {pitch.toFixed(1)}
                    </label>
                    <input
                        id="pitch-slider"
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                        className="slider"
                        aria-label="Adjust speech pitch"
                    />
                    <div className="slider-labels">
                        <span>Low</span>
                        <span>Normal</span>
                        <span>High</span>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="voice-setting-group">
                    <label htmlFor="volume-slider" className="setting-label">
                        <Volume2 size={16} />
                        Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                        id="volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                        className="slider"
                        aria-label="Adjust speech volume"
                    />
                    <div className="slider-labels">
                        <span>Quiet</span>
                        <span>Medium</span>
                        <span>Loud</span>
                    </div>
                </div>

                {/* Info Text */}
                <div className="voice-settings-info">
                    💡 Tip: Adjust these settings to find your perfect listening experience!
                </div>
            </motion.div>
        </Card>
    );
};

export default VoiceSettings;
