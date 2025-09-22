import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api';
import { useApi } from '../../hooks/useApi';
import type { RegisterModel } from '../../api/types/interfaces/registerModel';
import { useAuth } from '../../hooks/useAuth';
import type { AuthResponse } from '../../api/types/interfaces/authResponse'; // Import AuthResponse type

interface RegisterFormModel extends RegisterModel {
    confirmPassword: string;
}

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState<RegisterFormModel>({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        roles: ['Client'], // Default role
        fullName: '',
    });
    const { execute, loading, error } = useApi<AuthResponse>(); // Specify AuthResponse for useApi
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Destructure to send only properties present in RegisterModel to the API
            const { confirmPassword, ...registerModel } = form; 
            const data = await execute(() => registerApi(registerModel), 'Регистрация успешна');
            setUser(data.user); // data is now typed as AuthResponse
            navigate('/');
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
                Регистрация
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
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="fullName"
                    label="Полное имя"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
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
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Подтвердите пароль"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                />
                {/* <FormControl fullWidth margin="normal"> // Removed role selection, defaulting to Client
                    <InputLabel id="roles-label">Роль</InputLabel>
                    <Select
                        labelId="roles-label"
                        id="roles"
                        name="roles"
                        multiple
                        value={form.roles}
                        onChange={(e) => setForm({ ...form, roles: e.target.value as string[] })}
                        input={<OutlinedInput label="Роль" />}
                        renderValue={(selected) => (selected as string[]).join(', ')}
                    >
                        <MenuItem value="Client">Клиент</MenuItem>
                    </Select>
                </FormControl> */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
                <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                    Уже есть аккаунт? Войти
                </Link>
            </Box>
        </Box>
    );
};

export default RegisterPage;
