import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import { StatCard } from '../components/ui/Card';

/**
 * ParentDashboard - Refactored for Week 2 Finalization
 * Uses Card and StatCard components, fully responsive, dark mode support
 */
const ParentDashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/safety/alerts/');
            setAlerts(response.data.alerts || []);
        } catch (error) {
            console.error('Error fetching safety alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAlertColor = (type) => {
        switch (type) {
            case 'inappropriate_language': return 'var(--color-error)';
            case 'pii_leak': return 'var(--color-warning)';
            case 'prompt_injection': return '#7C3AED';
            default: return 'var(--color-gray-500)';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'inappropriate_language': return <MessageSquare size={20} />;
            case 'pii_leak': return <ShieldAlert size={20} />;
            case 'prompt_injection': return <AlertTriangle size={20} />;
            default: return <Clock size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="container loading-container">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="loading-content"
                >
                    <h3>Loading Parent Dashboard...</h3>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="container parent-dashboard">
            {/* Page Header */}
            <div className="dashboard-header">
                <ShieldAlert size={36} color="var(--color-indigo)" />
                <h1 className="hero-title">Parent Safety Dashboard</h1>
            </div>

            {/* Safety Summary */}
            <Card elevation="md" className="safety-summary-card">
                <h3 className="section-title">Safety Summary</h3>
                <div className="stats-grid">
                    <StatCard
                        icon="⚠️"
                        label="Language Alerts"
                        value={alerts.filter(a => a.type === 'inappropriate_language').length}
                    />
                    <StatCard
                        icon="🛡️"
                        label="Privacy Alerts"
                        value={alerts.filter(a => a.type === 'pii_leak').length}
                    />
                    <StatCard
                        icon="📊"
                        label="Total Incidents"
                        value={alerts.length}
                    />
                </div>
            </Card>

            {/* Recent Alerts */}
            <h2 className="section-title">Recent Alerts</h2>
            {alerts.length === 0 ? (
                <Card elevation="md" className="empty-alerts-card">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="empty-alerts-content"
                    >
                        <CheckCircle size={48} color="var(--color-success)" className="success-icon" />
                        <p className="empty-alerts-text">
                            All quiet! No safety incidents detected recently. ✨
                        </p>
                    </motion.div>
                </Card>
            ) : (
                <div className="alerts-list">
                    {alerts.map((alert, index) => (
                        <Card
                            key={alert.id}
                            hover={true}
                            elevation="sm"
                            className="alert-card"
                            style={{ borderLeft: `6px solid ${getAlertColor(alert.type)}` }}
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="alert-content"
                            >
                                <div className="alert-main">
                                    <div
                                        className="alert-icon-container"
                                        style={{
                                            background: `${getAlertColor(alert.type)}20`,
                                            color: getAlertColor(alert.type),
                                        }}
                                    >
                                        {getAlertIcon(alert.type)}
                                    </div>
                                    <div className="alert-details">
                                        <div className="alert-type">
                                            {alert.type.replace('_', ' ')}
                                        </div>
                                        <div className="alert-timestamp">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </div>
                                        <div className="alert-message">
                                            "{alert.content}"
                                        </div>
                                    </div>
                                </div>
                                <div className="alert-status">
                                    <span className={`status-badge ${alert.resolved ? 'resolved' : 'pending'}`}>
                                        {alert.resolved ? 'RESOLVED' : 'PENDING'}
                                    </span>
                                </div>
                            </motion.div>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
};

export default ParentDashboard;
