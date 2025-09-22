import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { assignUser } from '../../api';
import { useApi } from '../../hooks/useApi';
import type { AssignUserDto } from '../../api/types/interfaces/assignUserDto';
import {useAuth} from "../../hooks/useAuth.tsx";

const AssignUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState<AssignUserDto>({ userId: '', role: 'Manager' });
    const { execute, error, loading } = useApi();
    const { hasRole } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        setForm({ ...form, [e.target.name as string]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await execute(() => assignUser(Number(id), form), 'Сотрудник назначен');
            navigate(`/requests/${id}`);
        } catch (err) {
            console.error(err)
        }
    };

    if (!hasRole('Manager')) {
        return <Typography>Доступ запрещён</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Назначить сотрудника на заявку #{id}
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="ID пользователя"
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Роль</InputLabel>
                    <Select name="role" value={form.role} onChange={(value) => {
                        setForm({...form, role: value.target.value})
                    }}>
                        <MenuItem value="Manager">Менеджер</MenuItem>
                        <MenuItem value="Technician">Техник</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Назначить'}
                </Button>
            </Box>
        </Box>
    );
};

export default AssignUser;
