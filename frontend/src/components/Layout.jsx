import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import PageTransition from './PageTransition';

/**
 * Layout Component
 * Main layout wrapper with navigation and page transitions
 * Story 2.4: Added PageTransition for smooth route changes
 */
const Layout = () => {
    return (
        <>
            {/* Skip Navigation Link - WCAG AAA */}
            <a href="#main-content" className="skip-nav">
                Skip to main content
            </a>

            {/* Main Content Area with Page Transitions */}
            <main id="main-content" style={{ minHeight: '100vh', position: 'relative' }}>
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>

            {/* Fixed Navigation */}
            <Navbar />
        </>
    );
};

export default Layout;
