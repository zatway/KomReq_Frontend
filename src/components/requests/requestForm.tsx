import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Alert, Autocomplete } from '@mui/material';
import {createRequest, getRequest, updateRequest, getEquipmentTypes} from '../../api';
import { useApi } from '../../hooks/useApi';
import type {CreateRequestDto} from "../../api/types/interfaces/createRequestDto.ts";
import {useAuth} from "../../hooks/useAuth.tsx";
import type {RequestDto} from "../../api/types/interfaces/requestDto.ts";
import {searchUsers} from "../../api/auth.ts";
import {ROLES} from "../../constants/roles.ts";
import type {UpdateRequestDto} from "../../api/types/interfaces/updateRequestDto.ts"; // Import UpdateRequestDto

interface UserOption {
    id: string;
    userName: string;
    fullName?: string;
    email?: string;
}

interface EquipmentTypeOption {
    id: number;
    name: string;
}

const RequestForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const [form, setForm] = useState<CreateRequestDto>({
        // clientId: 0, // Удалено
        clientUserId: undefined,
        equipmentTypeId: 0,
        quantity: 1,
        priority: 'Medium',
        comments: '',
    });
    const [clientOptions, setClientOptions] = useState<UserOption[]>([]);
    const [selectedClient, setSelectedClient] = useState<UserOption | null>(null);
    const [equipmentTypeOptions, setEquipmentTypeOptions] = useState<EquipmentTypeOption[]>([]);
    const [selectedEquipmentType, setSelectedEquipmentType] = useState<EquipmentTypeOption | null>(null);
    const { execute, error, loading } = useApi<any>();
    const { hasRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit) {
            (async () => {
                const data = await execute(() => getRequest(Number(id)));
                const req = data as unknown as RequestDto;
                setForm({
                    // clientId: req.clientId ?? 0, // Удалено
                    clientUserId: req.creator?.id,
                    equipmentTypeId: req.equipmentType?.id ?? 0,
                    quantity: req.quantity ?? 1,
                    priority: req.priority as any,
                    comments: req.comments ?? '',
                    targetCompletion: req.targetCompletion ?? undefined,
                });
                if (req.creator) {
                    setSelectedClient({ // Устанавливаем выбранного клиента для Autocomplete
                        id: req.creator.id,
                        userName: req.creator.userName,
                        fullName: req.creator.fullName,
                        email: req.creator.email,
                    });
                }
                if (req.equipmentType) {
                    setSelectedEquipmentType({ // Устанавливаем выбранный тип оборудования для Autocomplete
                        id: req.equipmentType.id,
                        name: req.equipmentType.equipmentName,
                    });
                }
            })();
        }
    }, [id]);

    useEffect(() => {
        (async () => {
            const data = await execute(() => getEquipmentTypes());
            setEquipmentTypeOptions(data as EquipmentTypeOption[]);
        })();
    }, []);

    const handleClientSearch = async (query: string) => {
        if (query.length > 2) {
            const users = await searchUsers(query, ROLES.Client);
            setClientOptions(users);
        } else {
            setClientOptions([]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        setForm({ ...form, [e.target.name as string]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSend: CreateRequestDto = {
                equipmentTypeId: selectedEquipmentType?.id || 0,
                quantity: form.quantity,
                priority: form.priority,
                comments: form.comments,
                targetCompletion: form.targetCompletion,
                clientUserId: selectedClient?.id,
            };

            if (isEdit) {
                const updateDto: UpdateRequestDto = {
                    quantity: form.quantity,
                    priority: form.priority as any,
                    comments: form.comments,
                    targetCompletion: form.targetCompletion,
                    equipmentTypeId: selectedEquipmentType?.id || 0, // Now allowed in UpdateRequestDto
                };
                await execute(() => updateRequest(Number(id), updateDto), 'Заявка обновлена');
            } else {
                await execute(() => createRequest(dataToSend), 'Заявка создана');
            }
            navigate('/requests');
        } catch (err) {
            console.error(err);
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
                        <Autocomplete
                            options={clientOptions}
                            getOptionLabel={(option) => option.fullName || option.userName || option.email || ''}
                            filterOptions={(x) => x}
                            onInputChange={(_, newInputValue) => { // Changed event to _
                                handleClientSearch(newInputValue);
                            }}
                            onChange={(_, newValue) => { // Changed event to _
                                setSelectedClient(newValue);
                            }}
                            value={selectedClient}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Клиент (поиск по имени/email)"
                                />
                            )}
                        />
                        <Autocomplete
                            options={equipmentTypeOptions}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, newValue) => { // Changed event to _
                                setSelectedEquipmentType(newValue);
                            }}
                            value={selectedEquipmentType}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Тип оборудования"
                                />
                            )}
                        />
                    </>
                )}
                {isEdit && selectedClient && (
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Клиент: {selectedClient.fullName || selectedClient.userName || selectedClient.email}
                    </Typography>
                )}
                {isEdit && selectedEquipmentType && (
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Тип оборудования: {selectedEquipmentType.name}
                    </Typography>
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
                        setForm({...form, priority: value.target.value as any});
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
                    {loading ? 'Загрузка...' : 'Создать'}
                </Button>
            </Box>
        </Box>
    );
};

export default RequestForm;
