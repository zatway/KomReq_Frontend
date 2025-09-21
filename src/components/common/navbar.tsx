import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {useAuth} from "../../hooks/useAuth.tsx";

const Navbar: React.FC = () => {
    const { user, hasRole, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    KomReq
                </Typography>
                {user && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" onClick={() => navigate('/requests')}>
                            Заявки
                        </Button>
                        {hasRole('Admin') && (
                            <Button color="inherit" onClick={() => navigate('/admin/users')}>
                                Пользователи
                            </Button>
                        )}
                        <Button color="inherit" onClick={() => navigate('/change-password')}>
                            Сменить пароль
                        </Button>
                        <Button color="inherit" onClick={logout}>
                            Выйти
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
