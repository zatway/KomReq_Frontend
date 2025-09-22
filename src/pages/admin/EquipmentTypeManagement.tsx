import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { getEquipmentTypes, getEquipmentTypeById, createEquipmentType, updateEquipmentType, deleteEquipmentType,
    type EquipmentTypeDto, type CreateEquipmentTypeDto, type UpdateEquipmentTypeDto } from '../../api';
import { useSnackbar } from '../../contexts/snackbarContext';

const EquipmentTypeManagement: React.FC = () => {
    const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypeDto[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEquipmentType, setCurrentEquipmentType] = useState<EquipmentTypeDto | null>(null);
    const [formState, setFormState] = useState<CreateEquipmentTypeDto | UpdateEquipmentTypeDto>({
        name: '',
        description: null,
        specifications: null,
        price: 0,
        isActive: true,
    });
    const { execute, loading, error } = useApi();
    const { showMessage } = useSnackbar(); // Changed to showMessage

    const fetchEquipmentTypes = async () => {
        const data = await execute(() => getEquipmentTypes());
        if (data) {
            setEquipmentTypes(data as EquipmentTypeDto[]);
        }
    };

    useEffect(() => {
        fetchEquipmentTypes();
    }, []);

    const handleOpenCreateDialog = () => {
        setIsEditing(false);
        setCurrentEquipmentType(null);
        setFormState({
            name: '',
            description: null,
            specifications: null,
            price: 0,
            isActive: true,
        });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = async (id: number) => {
        setIsEditing(true);
        const data = await execute(() => getEquipmentTypeById(id));
        if (data) {
            const eqType = data as EquipmentTypeDto;
            setCurrentEquipmentType(eqType);
            setFormState({
                name: eqType.name,
                description: eqType.description,
                specifications: eqType.specifications,
                price: eqType.price,
                isActive: eqType.isActive,
            });
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormState(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentEquipmentType) {
                await execute(() => updateEquipmentType(currentEquipmentType.id, formState as UpdateEquipmentTypeDto), 'Тип оборудования обновлен');
            } else {
                await execute(() => createEquipmentType(formState as CreateEquipmentTypeDto), 'Тип оборудования создан');
            }
            showMessage('Операция успешна', 'success'); // Changed to showMessage
            handleCloseDialog();
            fetchEquipmentTypes();
        } catch (err: any) {
            showMessage(error || 'Ошибка при сохранении', 'error'); // Changed to showMessage
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тип оборудования?')) {
            try {
                await execute(() => deleteEquipmentType(id), 'Тип оборудования удален (логически)');
                showMessage('Тип оборудования удален (логически)', 'success'); // Changed to showMessage
                fetchEquipmentTypes();
            } catch (err: any) {
                showMessage(error || 'Ошибка при удалении', 'error'); // Changed to showMessage
                console.error(err);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Управление типами оборудования</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog} sx={{ mb: 2 }}>
                Добавить тип оборудования
            </Button>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Характеристики</TableCell>
                            <TableCell>Цена</TableCell>
                            <TableCell>Активен</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell align="right">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {equipmentTypes.map((et) => (
                            <TableRow key={et.id}>
                                <TableCell>{et.id}</TableCell>
                                <TableCell>{et.name}</TableCell>
                                <TableCell>{et.description}</TableCell>
                                <TableCell>{et.specifications}</TableCell>
                                <TableCell>{et.price}</TableCell>
                                <TableCell>{et.isActive ? 'Да' : 'Нет'}</TableCell>
                                <TableCell>{new Date(et.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenEditDialog(et.id)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(et.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Редактировать тип оборудования' : 'Добавить тип оборудования'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        margin="dense"
                        name="name"
                        label="Название"
                        type="text"
                        fullWidth
                        value={formState.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Описание"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={formState.description || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="specifications"
                        label="Характеристики (JSON)"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={formState.specifications || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Цена"
                        type="number"
                        fullWidth
                        value={formState.price}
                        onChange={handleChange}
                        required
                    />
                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formState.isActive}
                            onChange={handleChange}
                        />
                        <label htmlFor="isActive">Активен</label>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSubmit} color="primary" disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EquipmentTypeManagement;
