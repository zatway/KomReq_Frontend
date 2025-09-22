import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, Alert } from '@mui/material';
import { login } from '../api';
import { useApi } from '../hooks/useApi';
import {useAuth} from "../hooks/useAuth.tsx";
import type {AuthResponse} from "../api/types/interfaces/authResponse.ts";

const LoginPage: React.FC = () => {
    const [form, setForm] = useState({ userName: '', password: '' });
    const { setUser } = useAuth();
    const {execute, error, loading } = useApi<AuthResponse>();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response: AuthResponse = await execute(() => login(form));
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            navigate(response.user.roles?.includes('Admin') ? '/admin' : '/');
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Вход
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Имя пользователя"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Пароль"
                        name="password"
                        type="password"
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
                        {loading ? 'Загрузка...' : 'Войти'}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/register')}
                    >
                        Нет аккаунта? Зарегистрироваться
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
