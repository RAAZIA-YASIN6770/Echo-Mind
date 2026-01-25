import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Volume2, Globe, LogOut, Save } from 'lucide-react';

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
        <div className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem', maxWidth: '1400px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-center" style={{ marginBottom: '3rem' }}>
                    Settings ⚙️
                </h1>
            </motion.div>

            {/* Landscape Layout - 2 Column Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
            }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* User Profile Section */}
                    <SettingsSection
                        icon={<User size={24} />}
                        title="User Profile"
                        delay={0.1}
                    >
                        <InputField
                            label="Username"
                            value={settings.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                        />
                        <InputField
                            label="Email"
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        <InputField
                            label="Age"
                            type="number"
                            value={settings.age}
                            onChange={(e) => handleChange('age', parseInt(e.target.value))}
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
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', color: 'var(--color-gray-700)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            🛡️ Your safety is our priority. All conversations are monitored for inappropriate content.
                        </div>
                    </SettingsSection>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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

                    {/* Account Actions Section */}
                    <SettingsSection
                        icon={<User size={24} />}
                        title="Account Actions"
                        delay={0.6}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <motion.button
                                className="btn btn-primary"
                                style={{
                                    fontSize: '1rem',
                                    padding: '0.875rem 2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    width: '100%'
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                            >
                                <Save size={18} />
                                {saved ? '✅ Settings Saved!' : 'Save All Settings'}
                            </motion.button>

                            <button
                                style={{
                                    background: 'none',
                                    border: '2px solid #ef4444',
                                    color: '#ef4444',
                                    padding: '0.875rem 2rem',
                                    borderRadius: 'var(--radius-xl)',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    width: '100%'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#ef4444';
                                    e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'none';
                                    e.target.style.color = '#ef4444';
                                }}
                            >
                                <LogOut size={18} />
                                Logout from Account
                            </button>
                        </div>
                    </SettingsSection>
                </div>
            </div>

            {/* Mobile Responsive Note */}
            <style jsx>{`
                @media (max-width: 1100px) {
                    .container > div:first-of-type {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );

};

// Reusable Components
const SettingsSection = ({ icon, title, children, delay }) => (
    <motion.div
        className="glass-panel"
        style={{ padding: '2rem', marginBottom: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ color: 'var(--color-primary)' }}>{icon}</div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {children}
        </div>
    </motion.div>
);

const InputField = ({ label, type = 'text', value, onChange }) => (
    <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text-main)' }}>
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-border)',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }) => (
    <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text-main)' }}>
            {label}
        </label>
        <select
            value={value}
            onChange={onChange}
            style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-border)',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontWeight: '500', color: 'var(--color-text-main)' }}>
            {label}
        </label>
        <div
            onClick={() => onChange(!checked)}
            style={{
                width: '50px',
                height: '26px',
                borderRadius: '13px',
                background: checked ? 'var(--color-primary)' : '#ccc',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
            }}
        >
            <motion.div
                style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '2px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                animate={{ left: checked ? '26px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </div>
    </div>
);

export default SettingsPage;
