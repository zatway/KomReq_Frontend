import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { Navbar } from './navbar';

export const Layout = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
};
