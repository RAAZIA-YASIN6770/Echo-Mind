import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import api from '../services/api';

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
            case 'inappropriate_language': return '#EF4444'; // Red
            case 'pii_leak': return '#F59E0B'; // Orange
            case 'prompt_injection': return '#7C3AED'; // Purple
            default: return '#6B7280'; // Gray
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
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h3>Loading Parent Dashboard...</h3>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '8rem', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <ShieldAlert size={36} color="#4F46E5" />
                <h1 style={{ margin: 0 }}>Parent Safety Dashboard</h1>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3>Safety Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: '#FEE2E2', borderRadius: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#B91C1C' }}>
                            {alerts.filter(a => a.type === 'inappropriate_language').length}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#991B1B' }}>Language Alerts</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400E' }}>
                            {alerts.filter(a => a.type === 'pii_leak').length}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#854D0E' }}>Privacy Alerts</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#F3F4F6', borderRadius: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#374151' }}>
                            {alerts.length}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#4B5563' }}>Total Incidents</div>
                    </div>
                </div>
            </div>

            <h2>Recent Alerts</h2>
            {alerts.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <CheckCircle size={48} color="#10B981" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--color-text-secondary)' }}>All quiet! No safety incidents detected recently. ✨</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {alerts.map((alert, index) => (
                        <motion.div
                            key={alert.id}
                            className="card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                padding: '1.5rem',
                                borderLeft: `6px solid ${getAlertColor(alert.type)}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    background: `${getAlertColor(alert.type)}20`,
                                    color: getAlertColor(alert.type),
                                    borderRadius: '12px'
                                }}>
                                    {getAlertIcon(alert.type)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                                        {alert.type.replace('_', ' ')}
                                    </div>
                                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </div>
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '0.75rem',
                                        background: '#F9FAFB',
                                        borderRadius: '8px',
                                        fontStyle: 'italic',
                                        border: '1px solid #E5E7EB'
                                    }}>
                                        "{alert.content}"
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: alert.resolved ? '#D1FAE5' : '#FEE2E2',
                                    color: alert.resolved ? '#065F46' : '#991B1B',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {alert.resolved ? 'RESOLVED' : 'PENDING'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentDashboard;
