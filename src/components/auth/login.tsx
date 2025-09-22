import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import type { AuthResponse } from '../../api/types/interfaces/authResponse'; // Import AuthResponse type

const LoginPage: React.FC = () => {
    const [form, setForm] = useState({ userName: '', password: '' });
    const { setUser } = useAuth(); // Corrected to setUser
    const { execute, loading, error } = useApi<AuthResponse>(); // Specify AuthResponse for useApi
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await execute(() => loginApi(form), 'Вход выполнен успешно');
            setUser(data.user); // data is now typed as AuthResponse
            navigate('/');
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
                Вход
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="userName"
                    label="Имя пользователя"
                    name="userName"
                    autoComplete="username"
                    autoFocus
                    value={form.userName}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </Button>
                <Link component="button" variant="body2" onClick={() => navigate('/register')}>
                    Нет аккаунта? Зарегистрироваться
                </Link>
            </Box>
        </Box>
    );
};

export default LoginPage;
