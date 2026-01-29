import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useSpeechSynthesis Hook - Story 3.1: AI Voice Synthesis
 * Manages Web Speech API for text-to-speech functionality
 * Maintains accessibility (WCAG AAA) and provides voice controls
 */
const useSpeechSynthesis = () => {
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [rate, setRate] = useState(1.0); // 0.5 to 2.0
    const [pitch, setPitch] = useState(1.0); // 0 to 2
    const [volume, setVolume] = useState(1.0); // 0 to 1
    const utteranceRef = useRef(null);

    // Check if speech synthesis is supported
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    // Load available voices
    useEffect(() => {
        if (!supported) return;

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Set default voice (prefer English)
            if (availableVoices.length > 0 && !selectedVoice) {
                const englishVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                setSelectedVoice(englishVoice);
            }
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, [supported, selectedVoice]);

    // Speak text
    const speak = useCallback((text) => {
        if (!supported || !text) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Set voice properties
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        // Event handlers
        utterance.onstart = () => {
            setSpeaking(true);
            setPaused(false);
        };

        utterance.onend = () => {
            setSpeaking(false);
            setPaused(false);
            utteranceRef.current = null;
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setSpeaking(false);
            setPaused(false);
            utteranceRef.current = null;
        };

        utterance.onpause = () => {
            setPaused(true);
        };

        utterance.onresume = () => {
            setPaused(false);
        };

        // Start speaking
        window.speechSynthesis.speak(utterance);
    }, [supported, selectedVoice, rate, pitch, volume]);

    // Pause speech
    const pause = useCallback(() => {
        if (!supported || !speaking) return;
        window.speechSynthesis.pause();
    }, [supported, speaking]);

    // Resume speech
    const resume = useCallback(() => {
        if (!supported || !speaking) return;
        window.speechSynthesis.resume();
    }, [supported, speaking]);

    // Stop speech
    const stop = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
    }, [supported]);

    return {
        supported,
        speaking,
        paused,
        voices,
        selectedVoice,
        rate,
        pitch,
        volume,
        speak,
        pause,
        resume,
        stop,
        setSelectedVoice,
        setRate,
        setPitch,
        setVolume,
    };
};

export default useSpeechSynthesis;
