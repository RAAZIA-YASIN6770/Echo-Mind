import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, LogOut, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

/**
 * SettingsPage - Story 3.1 Refactored
 * Uses Card, Button, and Input components
 * Fully responsive, dark mode support, micro-interactions
 */
const SettingsPage = () => {
    const [settings, setSettings] = useState({
        // User Profile
        username: 'demo_user',
        email: 'student@echomind.com',
        age: 10,

        // Notifications
        soundEffects: true,
        treeGrowthNotifications: true,
        badgeUnlockNotifications: true,
        dailyChallengeReminders: true,

        // Privacy
        parentalControls: true,
        shareProgress: false,

        // Appearance
        theme: 'light',
        fontSize: 'medium',
        animations: true,

        // Learning
        difficultyLevel: 'auto',
        language: 'en',
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        // TODO: Save to backend API
        console.log('Saving settings:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <main className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem', maxWidth: '1400px' }}>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="hero-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    Settings ⚙️
                </h1>
            </motion.div>

            {/* Settings Grid - Story 3.1: Responsive 2-column layout */}
            <div className="settings-grid">
                {/* Left Column */}
                <div className="settings-column">
                    {/* User Profile Section */}
                    <SettingsSection
                        icon={<User size={24} />}
                        title="User Profile"
                        delay={0.1}
                    >
                        <Input
                            label="Username"
                            value={settings.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            placeholder="Enter your username"
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                        />
                        <Input
                            label="Age"
                            type="number"
                            value={settings.age}
                            onChange={(e) => handleChange('age', parseInt(e.target.value))}
                            placeholder="Your age"
                        />
                    </SettingsSection>

                    {/* Notifications Section */}
                    <SettingsSection
                        icon={<Bell size={24} />}
                        title="Notifications"
                        delay={0.2}
                    >
                        <ToggleSwitch
                            label="Sound Effects"
                            checked={settings.soundEffects}
                            onChange={(checked) => handleChange('soundEffects', checked)}
                        />
                        <ToggleSwitch
                            label="Tree Growth Notifications"
                            checked={settings.treeGrowthNotifications}
                            onChange={(checked) => handleChange('treeGrowthNotifications', checked)}
                        />
                        <ToggleSwitch
                            label="Badge Unlock Notifications"
                            checked={settings.badgeUnlockNotifications}
                            onChange={(checked) => handleChange('badgeUnlockNotifications', checked)}
                        />
                        <ToggleSwitch
                            label="Daily Challenge Reminders"
                            checked={settings.dailyChallengeReminders}
                            onChange={(checked) => handleChange('dailyChallengeReminders', checked)}
                        />
                    </SettingsSection>

                    {/* Privacy Section */}
                    <SettingsSection
                        icon={<Shield size={24} />}
                        title="Privacy & Safety"
                        delay={0.3}
                    >
                        <ToggleSwitch
                            label="Parental Controls"
                            checked={settings.parentalControls}
                            onChange={(checked) => handleChange('parentalControls', checked)}
                        />
                        <ToggleSwitch
                            label="Share Progress with Parents"
                            checked={settings.shareProgress}
                            onChange={(checked) => handleChange('shareProgress', checked)}
                        />
                        <div className="info-box">
                            🛡️ Your safety is our priority. All conversations are monitored for inappropriate content.
                        </div>
                    </SettingsSection>
                </div>

                {/* Right Column */}
                <div className="settings-column">
                    {/* Appearance Section */}
                    <SettingsSection
                        icon={<Palette size={24} />}
                        title="Appearance"
                        delay={0.4}
                    >
                        <SelectField
                            label="Theme"
                            value={settings.theme}
                            onChange={(e) => handleChange('theme', e.target.value)}
                            options={[
                                { value: 'light', label: '☀️ Light' },
                                { value: 'dark', label: '🌙 Dark' },
                                { value: 'auto', label: '🔄 Auto' }
                            ]}
                        />
                        <SelectField
                            label="Font Size"
                            value={settings.fontSize}
                            onChange={(e) => handleChange('fontSize', e.target.value)}
                            options={[
                                { value: 'small', label: 'Small' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'large', label: 'Large' }
                            ]}
                        />
                        <ToggleSwitch
                            label="Animations"
                            checked={settings.animations}
                            onChange={(checked) => handleChange('animations', checked)}
                        />
                    </SettingsSection>

                    {/* Learning Preferences */}
                    <SettingsSection
                        icon={<Globe size={24} />}
                        title="Learning Preferences"
                        delay={0.5}
                    >
                        <SelectField
                            label="Difficulty Level"
                            value={settings.difficultyLevel}
                            onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                            options={[
                                { value: 'easy', label: '🌱 Easy' },
                                { value: 'medium', label: '🌿 Medium' },
                                { value: 'hard', label: '🌳 Hard' },
                                { value: 'auto', label: '🔄 Auto-Adjust' }
                            ]}
                        />
                        <SelectField
                            label="Language"
                            value={settings.language}
                            onChange={(e) => handleChange('language', e.target.value)}
                            options={[
                                { value: 'en', label: '🇺🇸 English' },
                                { value: 'ur', label: '🇵🇰 Urdu' },
                                { value: 'es', label: '🇪🇸 Spanish' }
                            ]}
                        />
                    </SettingsSection>

                    {/* Account Actions Section - Story 3.1: Using Button component */}
                    <SettingsSection
                        icon={<User size={24} />}
                        title="Account Actions"
                        delay={0.6}
                    >
                        <div className="button-group">
                            <Button
                                variant="primary"
                                size="lg"
                                icon={<Save size={18} />}
                                onClick={handleSave}
                                className="full-width"
                            >
                                {saved ? '✅ Settings Saved!' : 'Save All Settings'}
                            </Button>

                            <Button
                                variant="danger"
                                size="lg"
                                icon={<LogOut size={18} />}
                                className="full-width"
                            >
                                Logout from Account
                            </Button>
                        </div>
                    </SettingsSection>
                </div>
            </div>
        </main>
    );
};

// Story 3.1: Refactored SettingsSection using Card component
const SettingsSection = ({ icon, title, children, delay }) => (
    <Card
        hover={false}
        elevation="md"
        className="settings-section"
    >
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <div className="section-header">
                <div className="section-icon">{icon}</div>
                <h2 className="section-title">{title}</h2>
            </div>
            <div className="section-content">
                {children}
            </div>
        </motion.div>
    </Card>
);

// SelectField component - using native select with our styles
const SelectField = ({ label, value, onChange, options }) => (
    <div className="select-field">
        <label className="input-label">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="input-field"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

// ToggleSwitch component - Story 3.1: Enhanced with micro-interactions
const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="toggle-switch-container">
        <label className="toggle-label">{label}</label>
        <motion.div
            className="toggle-switch"
            onClick={() => onChange(!checked)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                background: checked ? 'var(--color-indigo)' : 'var(--color-gray-300)',
            }}
        >
            <motion.div
                className="toggle-thumb"
                animate={{ left: checked ? '26px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </motion.div>
    </div>
);

export default SettingsPage;
