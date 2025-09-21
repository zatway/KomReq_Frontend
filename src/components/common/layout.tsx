import React from 'react';
import { Box } from '@mui/material';
import Navbar from './navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box>
            <Navbar />
            <Box sx={{ p: 3 }}>{children}</Box>
        </Box>
    );
};

export default Layout;
