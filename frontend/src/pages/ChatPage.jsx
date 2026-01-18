import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import api from '../services/api';

const ChatPage = () => {
    const defaultMessage = { id: 1, text: "Hello! I'm Eco-Mind, your Socratic mentor. What's on your mind today? 🌿", sender: 'bot' };
    const [messages, setMessages] = useState([defaultMessage]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

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

            const botMsg = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot'
            };

            setMessages(prev => [...prev, botMsg]);

            // 1. Show tree update notification
            if (treeUpdate && treeUpdate.growth) {
                const notificationMsg = {
                    id: Date.now() + 2,
                    text: treeUpdate.message,
                    sender: 'notification',
                    type: 'tree_growth'
                };

                setTimeout(() => {
                    setMessages(prev => [...prev, notificationMsg]);
                }, 800);
            }

            // 2. Show badge notifications
            newBadges.forEach((badge, index) => {
                const badgeMsg = {
                    id: Date.now() + 10 + index,
                    text: `🏆 ACHIEVEMENT UNLOCKED: ${badge.title}! ${badge.description}`,
                    sender: 'notification',
                    type: 'badge'
                };

                setTimeout(() => {
                    setMessages(prev => [...prev, badgeMsg]);
                }, 1500 + (index * 1000));
            });

        } catch (error) {
            console.error("Chat Error:", error);
            const backendError = error.response?.data?.error;
            const errorMsg = {
                id: Date.now() + 2,
                text: backendError
                    ? `Backend Error: ${backendError} 🧠💥`
                    : "Sorry, I'm having trouble connecting to my mind right now. 🧠💥",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    const handleReset = () => {
        setMessages([defaultMessage]);
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem', paddingTop: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>Chat with Eco-Mind 🤖</h1>
                <button
                    type="button"
                    onClick={handleReset}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#FEE2E2',
                        color: '#EF4444',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <Trash2 size={18} />
                    Reset Conversation
                </button>
            </div>

            <div className="glass-panel" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1rem'
            }}>
                {/* Chat Messages Area */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                alignSelf: msg.sender === 'notification' ? 'center' : (msg.sender === 'user' ? 'flex-end' : 'flex-start'),
                                maxWidth: msg.sender === 'notification' ? '90%' : '80%',
                                padding: '1rem 1.5rem',
                                borderRadius: msg.sender === 'notification' ? '1rem' : (msg.sender === 'user' ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0'),
                                backgroundColor: msg.sender === 'notification' ? 'transparent' : (msg.sender === 'user' ? '#10B981' : 'white'),
                                background: msg.sender === 'notification'
                                    ? (msg.type === 'badge'
                                        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' // Gold for badges
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)') // Purple for tree
                                    : (msg.sender === 'user' ? '#10B981' : 'white'),
                                color: (msg.sender === 'user' || msg.sender === 'notification') ? 'white' : '#064E3B',
                                boxShadow: msg.sender === 'notification'
                                    ? (msg.type === 'badge'
                                        ? '0 8px 25px rgba(245, 158, 11, 0.5)' // Gold glow
                                        : '0 8px 20px rgba(102, 126, 234, 0.4)') // Purple glow
                                    : 'var(--shadow-sm)',
                                textAlign: msg.sender === 'notification' ? 'center' : 'left',
                                fontWeight: msg.sender === 'notification' ? '600' : 'normal',
                                border: msg.sender === 'notification'
                                    ? '2px solid rgba(255, 255, 255, 0.3)'
                                    : '1px solid rgba(0,0,0,0.05)'
                            }}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Fixed Input Area */}
                <div style={{
                    padding: '1.5rem 2rem',
                    background: 'white',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your question here..."
                        style={{
                            flex: 1,
                            padding: '1.2rem',
                            borderRadius: 'var(--radius-full)',
                            border: '2px solid #E5E7EB',
                            fontSize: '1.1rem',
                            color: '#064E3B', // Deep green text
                            backgroundColor: '#FFFFFF',
                            fontFamily: 'var(--font-body)',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            width: '55px',
                            height: '55px',
                            borderRadius: '50%',
                            backgroundColor: '#10B981',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
