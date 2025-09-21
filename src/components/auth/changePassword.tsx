import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import { changePassword } from '../../api';
import { useApi } from '../../hooks/useApi';
import type { ChangePasswordModel } from '../../api/types/interfaces/changePasswordModel';
import {useAuth} from "../../hooks/useAuth.tsx";

const ChangePassword: React.FC = () => {
    const [form, setForm] = useState<ChangePasswordModel>({ userId: '', currentPassword: '', newPassword: '' });
    const { user, hasRole } = useAuth();
    const { execute, error, loading } = useApi();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await execute(() => changePassword({ ...form, userId: user?.id || '' }));
            navigate('/');
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Смена пароля
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                {!hasRole('Admin') && (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Текущий пароль"
                        name="currentPassword"
                        type="password"
                        value={form.currentPassword}
                        onChange={handleChange}
                    />
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Новый пароль"
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Сменить пароль'}
                </Button>
            </Box>
        </Box>
    );
};

export default ChangePassword;
