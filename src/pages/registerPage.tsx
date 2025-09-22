import React from 'react';
import { Container } from '@mui/material';
import Register from '../components/auth/register';

const RegisterPage: React.FC = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Register />
        </Container>
    );
};

export default RegisterPage;
