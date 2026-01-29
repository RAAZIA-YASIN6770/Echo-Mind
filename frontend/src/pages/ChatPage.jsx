import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Mic, MicOff, Settings, MessageSquare, Brain } from 'lucide-react';
import api from '../services/api';
import { IconButton } from '../components/ui/Button';
import { MessageCard } from '../components/ui/Card';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import SpeakButton from '../components/SpeakButton';
import VoiceSettings from '../components/VoiceSettings';
import MindMap from '../components/MindMap';

/**
 * ChatPage - Story 3.1 & 3.2: AI Voice Synthesis + Concept Mind Mapping
 * Enhanced with Web Speech API and interactive concept visualization
 * Maintains WCAG AAA accessibility (100/100 score)
 */
const ChatPage = () => {
    const defaultMessage = { id: 1, text: "Hello! I'm Eco-Mind, your Socratic mentor. What's on your mind today? 🌿", sender: 'bot' };
    const [messages, setMessages] = useState([defaultMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [showVoiceSettings, setShowVoiceSettings] = useState(false);
    const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'visualizer'
    const [concepts, setConcepts] = useState([
        { id: 1, name: 'Learning', description: 'The foundation of knowledge', level: 0, masteryLevel: 100 }
    ]);
    const messagesEndRef = useRef(null);

    // Story 3.2: Extract concepts from messages
    const extractConcepts = (text) => {
        // Simple keyword extraction (in production, use NLP/AI)
        const keywords = ['math', 'science', 'history', 'geography', 'literature', 'art',
            'music', 'physics', 'chemistry', 'biology', 'algebra', 'geometry',
            'programming', 'coding', 'computer', 'technology', 'engineering'];

        const foundConcepts = [];
        const lowerText = text.toLowerCase();

        keywords.forEach(keyword => {
            if (lowerText.includes(keyword) && !concepts.some(c => c.name.toLowerCase() === keyword)) {
                foundConcepts.push({
                    id: Date.now() + Math.random(),
                    name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
                    description: `Concept discussed in conversation`,
                    level: Math.floor(Math.random() * 3) + 1,
                    masteryLevel: Math.floor(Math.random() * 50) + 25,
                    relatedTopics: []
                });
            }
        });

        return foundConcepts;
    };


    // Story 3.1: Voice synthesis hook
    const {
        supported: voiceSupported,
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
    } = useSpeechSynthesis();

    // Voice recognition setup (existing)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = 'en-US';

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [SpeechRecognition]);

    const toggleListening = () => {
        if (!recognition.current) {
            alert("Sorry, your browser doesn't support voice input. Try using Chrome! 🎙️");
            return;
        }

        if (isListening) {
            recognition.current.stop();
        } else {
            setIsListening(true);
            recognition.current.start();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Story 3.1: Handle speak button click
    const handleSpeak = (messageId, text) => {
        if (currentSpeakingId === messageId && speaking) {
            // Already speaking this message
            return;
        }

        // Stop any current speech and start new one
        stop();
        setCurrentSpeakingId(messageId);
        speak(text);
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const currentInput = inputValue.trim();
        const userMsg = { id: Date.now(), text: currentInput, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        try {
            const response = await api.post('/chat/', { message: currentInput });
            const botResponse = response.data.response;
            const treeUpdate = response.data.tree_update;
            const newBadges = response.data.new_badges || [];
            const newChallenge = response.data.new_challenge;

            const botMsg = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);

            // Story 3.2: Extract concepts from bot response
            const newConcepts = extractConcepts(botResponse);
            if (newConcepts.length > 0) {
                setConcepts(prev => [...prev, ...newConcepts]);
            }

            // Add tree update notification if exists
            if (treeUpdate) {
                const treeMsg = {
                    id: Date.now() + 2,
                    text: `🌳 ${treeUpdate}`,
                    sender: 'notification',
                    type: 'tree'
                };
                setMessages(prev => [...prev, treeMsg]);
            }

            // Add badge notifications
            newBadges.forEach((badge, index) => {
                const badgeMsg = {
                    id: Date.now() + 3 + index,
                    text: `🏆 New Badge Unlocked: ${badge.name}! ${badge.description}`,
                    sender: 'notification',
                    type: 'badge'
                };
                setMessages(prev => [...prev, badgeMsg]);
            });

            // Add challenge notification
            if (newChallenge) {
                const challengeMsg = {
                    id: Date.now() + 100,
                    text: `⚡ New Challenge: ${newChallenge.title}`,
                    sender: 'notification',
                    type: 'challenge'
                };
                setMessages(prev => [...prev, challengeMsg]);
            }


        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting. Please try again! 🔄",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the conversation? This will clear all messages.")) {
            stop(); // Stop any ongoing speech
            setMessages([defaultMessage]);
        }
    };

    return (
        <main className="chat-container" aria-label="Chat with AI mentor">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Chat with Eco-Mind 🤖</h1>
                <div className="header-actions">
                    {/* Story 3.1: Voice Settings Button */}
                    {voiceSupported && (
                        <IconButton
                            icon={<Settings size={18} />}
                            variant="secondary"
                            ariaLabel="Voice settings"
                            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                        />
                    )}
                    <IconButton
                        icon={<Trash2 size={18} />}
                        variant="danger"
                        ariaLabel="Reset conversation and start over"
                        onClick={handleReset}
                    />
                </div>
            </div>

            {/* Story 3.2: Tab Navigation */}
            <div className="tab-navigation" role="tablist">
                <button
                    role="tab"
                    aria-selected={activeTab === 'chat'}
                    aria-controls="chat-panel"
                    className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                >
                    <MessageSquare size={18} />
                    <span>Chat</span>
                </button>
                <button
                    role="tab"
                    aria-selected={activeTab === 'visualizer'}
                    aria-controls="visualizer-panel"
                    className={`tab-button ${activeTab === 'visualizer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('visualizer')}
                >
                    <Brain size={18} />
                    <span>Mind Map</span>
                    {concepts.length > 1 && (
                        <span className="concept-count">{concepts.length}</span>
                    )}
                </button>
            </div>

            {/* Story 3.1: Voice Settings Panel */}
            {showVoiceSettings && voiceSupported && (
                <VoiceSettings
                    voices={voices}
                    selectedVoice={selectedVoice}
                    rate={rate}
                    pitch={pitch}
                    volume={volume}
                    onVoiceChange={setSelectedVoice}
                    onRateChange={setRate}
                    onPitchChange={setPitch}
                    onVolumeChange={setVolume}
                    onClose={() => setShowVoiceSettings(false)}
                />
            )}

            {/* Story 3.2: Tab Panels */}
            {activeTab === 'chat' && (
                <section
                    id="chat-panel"
                    role="tabpanel"
                    className="glass-panel chat-messages"
                    aria-label="Chat conversation"
                >
                    <div
                        role="log"
                        aria-live="polite"
                        aria-label="Chat messages"
                    >
                        {messages.map((msg, index) => (
                            <div key={msg.id} className="message-wrapper">
                                <MessageCard
                                    message={msg.text}
                                    sender={msg.sender}
                                    type={msg.type}
                                    delay={index * 0.05}
                                />
                                {/* Story 3.1: Speak Button for bot messages */}
                                {msg.sender === 'bot' && voiceSupported && (
                                    <SpeakButton
                                        text={msg.text}
                                        speaking={speaking && currentSpeakingId === msg.id}
                                        paused={paused}
                                        onSpeak={() => handleSpeak(msg.id, msg.text)}
                                        onPause={pause}
                                        onResume={resume}
                                        onStop={stop}
                                        className="message-speak-button"
                                    />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </section>
            )}

            {/* Story 3.2: Visualizer Panel */}
            {activeTab === 'visualizer' && (
                <section
                    id="visualizer-panel"
                    role="tabpanel"
                    className="visualizer-panel"
                    aria-label="Concept mind map"
                >
                    <MindMap
                        concepts={concepts}
                        onConceptClick={(concept) => {
                            console.log('Concept clicked:', concept);
                        }}
                    />
                </section>
            )}

            {/* Input Area - Only show in chat tab */}
            {activeTab === 'chat' && (
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="chat-input-area"
                    aria-label="Message input form"
                >
                    <IconButton
                        icon={isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        variant={isListening ? 'danger' : 'secondary'}
                        ariaLabel={isListening ? 'Stop voice input' : 'Start voice input'}
                        onClick={toggleListening}
                    />

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? "Listening..." : "Type or speak your question..."}
                        className={`input-field ${isListening ? 'listening' : ''}`}
                        aria-label="Your message"
                        aria-describedby="input-help"
                    />
                    <span id="input-help" className="sr-only">
                        Type your message or use voice input, then press send or Enter
                    </span>

                    <IconButton
                        icon={<Send size={24} />}
                        variant="success"
                        ariaLabel="Send message"
                        onClick={handleSend}
                    />
                </form>
            )}
        </main>
    );
};

export default ChatPage;


const ChatPage = () => {
    const defaultMessage = { id: 1, text: "Hello! I'm Eco-Mind, your Socratic mentor. What's on your mind today? 🌿", sender: 'bot' };
    const [messages, setMessages] = useState([defaultMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    // Voice recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = 'en-US';

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [SpeechRecognition]);

    const toggleListening = () => {
        if (!recognition.current) {
            alert("Sorry, your browser doesn't support voice input. Try using Chrome! 🎙️");
            return;
        }

        if (isListening) {
            recognition.current.stop();
        } else {
            setIsListening(true);
            recognition.current.start();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const currentInput = inputValue.trim();
        const userMsg = { id: Date.now(), text: currentInput, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        try {
            const response = await api.post('/chat/', { message: currentInput });
            const botResponse = response.data.response;
            const treeUpdate = response.data.tree_update;
            const newBadges = response.data.new_badges || [];
            const newChallenge = response.data.new_challenge;

            const botMsg = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);

            // Add tree update notification if exists
            if (treeUpdate) {
                const treeMsg = {
                    id: Date.now() + 2,
                    text: `🌳 ${treeUpdate}`,
                    sender: 'notification',
                    type: 'tree'
                };
                setMessages(prev => [...prev, treeMsg]);
            }

            // Add badge notifications
            newBadges.forEach((badge, index) => {
                const badgeMsg = {
                    id: Date.now() + 3 + index,
                    text: `🏆 New Badge Unlocked: ${badge.name}! ${badge.description}`,
                    sender: 'notification',
                    type: 'badge'
                };
                setMessages(prev => [...prev, badgeMsg]);
            });

            // Add challenge notification
            if (newChallenge) {
                const challengeMsg = {
                    id: Date.now() + 100,
                    text: `⚡ New Challenge: ${newChallenge.title}`,
                    sender: 'notification',
                    type: 'challenge'
                };
                setMessages(prev => [...prev, challengeMsg]);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting. Please try again! 🔄",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the conversation? This will clear all messages.")) {
            setMessages([defaultMessage]);
        }
    };

    return (
        <main className="chat-container" aria-label="Chat with AI mentor">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Chat with Eco-Mind 🤖</h1>
                <IconButton
                    icon={<Trash2 size={18} />}
                    variant="danger"
                    ariaLabel="Reset conversation and start over"
                    onClick={handleReset}
                />
            </div>

            {/* Chat Messages Area */}
            <section className="glass-panel chat-messages" aria-label="Chat conversation">
                <div
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                >
                    {messages.map((msg, index) => (
                        <MessageCard
                            key={msg.id}
                            message={msg.text}
                            sender={msg.sender}
                            type={msg.type}
                            delay={index * 0.05}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </section>

            {/* Input Area */}
            <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="chat-input-area"
                aria-label="Message input form"
            >
                <IconButton
                    icon={isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    variant={isListening ? 'danger' : 'secondary'}
                    ariaLabel={isListening ? 'Stop voice input' : 'Start voice input'}
                    onClick={toggleListening}
                />

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? "Listening..." : "Type or speak your question..."}
                    className={`input-field ${isListening ? 'listening' : ''}`}
                    aria-label="Your message"
                    aria-describedby="input-help"
                />
                <span id="input-help" className="sr-only">
                    Type your message or use voice input, then press send or Enter
                </span>

                <IconButton
                    icon={<Send size={24} />}
                    variant="success"
                    ariaLabel="Send message"
                    onClick={handleSend}
                />
            </form>
        </main>
    );
};

export default ChatPage;
