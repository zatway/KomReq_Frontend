import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Alert } from '@mui/material';
import {createRequest, getRequest, updateRequest} from '../../api';
import { useApi } from '../../hooks/useApi';
import type {CreateRequestDto} from "../../api/types/interfaces/createRequestDto.ts";
import {useAuth} from "../../hooks/useAuth.tsx";
import type {RequestDto} from "../../api/types/interfaces/requestDto.ts";

const RequestForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const [form, setForm] = useState<CreateRequestDto>({
        clientId: 0,
        equipmentTypeId: 0,
        quantity: 1,
        priority: 'Medium',
        comments: '',
    });
    const { execute, error, loading } = useApi<any>();
    const { hasRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit) {
            (async () => {
                const data = await execute(() => getRequest(Number(id)));
                const req = data as unknown as RequestDto;
                setForm({
                    clientId: req.clientId ?? 0,
                    equipmentTypeId: req.equipmentTypeId ?? 0,
                    quantity: req.quantity ?? 1,
                    priority: req.priority as any,
                    comments: req.comments ?? '',
                    targetCompletion: req.targetCompletion ?? undefined,
                });
            })();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        setForm({ ...form, [e.target.name as string]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await execute(() => updateRequest(Number(id), {
                    quantity: form.quantity,
                    priority: form.priority as any,
                    comments: form.comments,
                    targetCompletion: form.targetCompletion,
                }), 'Заявка обновлена');
            } else {
                await execute(() => createRequest(form as CreateRequestDto), 'Заявка создана');
            }
            navigate('/requests');
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
                {isEdit ? 'Редактировать заявку' : 'Создать заявку'}
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                {!isEdit && (
                    <>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="ID клиента"
                            name="clientId"
                            type="number"
                            value={form.clientId}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="ID типа оборудования"
                            name="equipmentTypeId"
                            type="number"
                            value={form.equipmentTypeId}
                            onChange={handleChange}
                        />
                    </>
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Количество"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Приоритет</InputLabel>
                    <Select name="priority" value={form.priority} onChange={(value) => {
                        setForm({...form, priority: value.target.value as any})
                    }}>
                        <MenuItem value="Low">Низкий</MenuItem>
                        <MenuItem value="Medium">Средний</MenuItem>
                        <MenuItem value="High">Высокий</MenuItem>
                        <MenuItem value="Urgent">Срочный</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Целевая дата завершения"
                    name="targetCompletion"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.targetCompletion || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Комментарии"
                    name="comments"
                    multiline
                    rows={4}
                    value={form.comments || ''}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : isEdit ? 'Обновить' : 'Создать'}
                </Button>
            </Box>
        </Box>
    );
};

export default RequestForm;
