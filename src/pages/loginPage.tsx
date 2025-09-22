import React from 'react';
import { Container } from '@mui/material';
import Login from '../components/auth/login';

const LoginPage: React.FC = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Login />
        </Container>
    );
};

export default LoginPage;
