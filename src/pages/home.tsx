import React from 'react';
import { Typography, Box } from '@mui/material';

import {useAuth} from "../hooks/useAuth.tsx";

const Home: React.FC = () => {
    const { user } = useAuth();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Добро пожаловать, {user?.fullName || 'Гость'}
            </Typography>
            <Typography>Выберите действие в навигации для работы с заявками.</Typography>
        </Box>
    );
};

export default Home;
