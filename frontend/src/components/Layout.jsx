import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            {/* Main Content Area */}
            <main style={{ minHeight: '100vh', position: 'relative' }}>
                <Outlet />
            </main>

            {/* Fixed Navigation */}
            <Navbar />
        </>
    );
};



export default Layout;
