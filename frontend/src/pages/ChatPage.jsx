import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Eco-Mind, your Socratic mentor. What's on your mind today? 🌿", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simulate bot thinking and response
        setTimeout(() => {
            const botMsg = { id: Date.now() + 1, text: "That's an interesting thought! Can you tell me more about why you think that?", sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-center">Chat with Eco-Mind 🤖</h1>

            <div className="glass-panel" style={{
                flex: 1,
                marginTop: '1rem',
                marginBottom: '6rem', // Space for input area
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Chat Messages Area */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '1rem 1.5rem',
                                borderRadius: msg.sender === 'user' ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0',
                                backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'white',
                                color: msg.sender === 'user' ? 'white' : 'var(--color-text-main)',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                </div>

                {/* Fixed Input Area */}
                <div style={{
                    padding: '1rem 2rem',
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
                            padding: '1rem',
                            borderRadius: 'var(--radius-full)',
                            border: '2px solid #E5E7EB',
                            fontSize: '1rem',
                            fontFamily: 'var(--font-body)',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
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
