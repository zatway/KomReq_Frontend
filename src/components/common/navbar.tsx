import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {useAuth} from "../../hooks/useAuth.tsx";
import {ROLES} from '../../constants/roles';

const Navbar: React.FC = () => {
    const { user, hasRole, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/') }>
                    KomReq
                </Typography>
                {user ? (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" onClick={() => navigate('/requests')}>
                            Заявки
                        </Button>
                        {hasRole(ROLES.Admin) && (
                            <Button color="inherit" onClick={() => navigate('/admin/users')}>
                                Пользователи
                            </Button>
                        )}
                        {hasRole(ROLES.Admin) && (
                            <Button color="inherit" onClick={() => navigate('/admin/equipment-types')}>
                                Типы оборудования
                            </Button>
                        )}
                        {hasRole(ROLES.Admin) && (
                            <Button color="inherit" onClick={() => navigate('/admin/audit-logs')}>
                                Журнал аудита
                            </Button>
                        )}
                        {(hasRole(ROLES.Admin) || hasRole(ROLES.Manager)) && (
                            <Button color="inherit" onClick={() => navigate('/admin/statistics')}>
                                Статистика
                            </Button>
                        )}
                        {(hasRole(ROLES.Admin) || hasRole(ROLES.Manager)) && (
                            <Button color="inherit" onClick={() => navigate('/admin/reports')}>
                                Отчеты
                            </Button>
                        )}
                        {hasRole(ROLES.Admin) && (
                            <Button color="inherit" onClick={() => navigate('/admin')}>
                                Админка
                            </Button>
                        )}
                        <Button color="inherit" onClick={() => navigate('/change-password')}>
                            Сменить пароль
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/notifications')}>
                            Уведомления
                        </Button>
                        <Button color="inherit" onClick={logout}>
                            Выйти
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" onClick={() => navigate('/login')}>Войти</Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>Регистрация</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
