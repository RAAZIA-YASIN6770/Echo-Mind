import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import api from '../services/api';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Eco-Mind, your Socratic mentor. What's on your mind today? 🌿", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: inputValue.trim(), sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue.trim(); // Save for API call
        setInputValue('');

        // Show loading/typing indicator (optional, simple approach for now)
        // const loadingMsg = { id: 'loading', text: '...', sender: 'bot' };
        // setMessages(prev => [...prev, loadingMsg]);

        try {
            // Import api service locally or at top level if not already imported
            // Assuming api is exported from '../services/api'
            // For this snippet, I will assume `import api from '../services/api';` is added at the top.

            const response = await api.post('/chat/', { message: currentInput });

            const botResponse = response.data.response;
            const treeUpdate = response.data.tree_update;

            const botMsg = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                treeUpdate: treeUpdate // unique property to perhaps show a badge or toast
            };

            setMessages(prev => [...prev, botMsg]);

            if (treeUpdate && treeUpdate.growth) {
                // You could trigger a toast notification here about tree growth
                console.log("Tree grew!", treeUpdate.message);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = { id: Date.now() + 2, text: "Sorry, I'm having trouble connecting to my mind right now. 🧠💥", sender: 'bot' };
            setMessages(prev => [...prev, errorMsg]);
        }
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
