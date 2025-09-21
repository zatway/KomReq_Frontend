import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserList from '../../components/admin/userList';

import {useAuth} from "../../hooks/useAuth.tsx";

const UserManagement: React.FC = () => {
    const { hasRole } = useAuth();
    const navigate = useNavigate();

    if (!hasRole('Admin')) {
        return <Typography>Доступ запрещён</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Управление пользователями
            </Typography>
            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => navigate('/register')}
            >
                Создать пользователя
            </Button>
            <UserList />
        </Box>
    );
};

export default UserManagement;
