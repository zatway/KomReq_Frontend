import React from 'react';
import { Typography, Box } from '@mui/material';

import {useAuth} from "../../hooks/useAuth.tsx";

const AdminDashboard: React.FC = () => {
    const { hasRole } = useAuth();

    if (!hasRole('Admin')) {
        return <Typography>Доступ запрещён</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Панель администратора
            </Typography>
            <Typography>Добро пожаловать в панель управления. Выберите действие в навигации.</Typography>
        </Box>
    );
};

export default AdminDashboard;
