import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            {/* Skip Navigation Link - WCAG AAA */}
            <a href="#main-content" className="skip-nav">
                Skip to main content
            </a>

            {/* Main Content Area */}
            <main id="main-content" style={{ minHeight: '100vh', position: 'relative' }}>
                <Outlet />
            </main>

            {/* Fixed Navigation */}
            <Navbar />
        </>
    );
};

export default Layout;
