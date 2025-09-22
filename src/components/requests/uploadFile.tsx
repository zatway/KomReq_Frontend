import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { uploadFile } from '../../api';
import { useApi } from '../../hooks/useApi';
import {useAuth} from "../../hooks/useAuth.tsx";

const UploadFile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState({ file: null as File | null, description: '', isConfidential: false });
    const { execute, error, loading } = useApi();
    const { hasRole } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm({ ...form, file });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setForm({ ...form, [name]: name === 'isConfidential' ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.file) return;
        const formData = new FormData();
        formData.append('File', form.file);
        formData.append('Description', form.description);
        formData.append('IsConfidential', form.isConfidential.toString());
        try {
            await execute(() => uploadFile(Number(id), formData), 'Файл загружен');
            navigate(`/requests/${id}`);
        } catch (err) {
            console.error(err)
        }
    };

    if (!hasRole('Manager') && !hasRole('Technician')) {
        return <Typography>Доступ запрещён</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Загрузка файла для заявки #{id}
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    style={{ margin: '16px 0' }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Описание"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="isConfidential"
                            checked={form.isConfidential}
                            onChange={handleChange}
                        />
                    }
                    label="Конфиденциальный"
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={loading || !form.file}
                >
                    {loading ? 'Загрузка...' : 'Загрузить'}
                </Button>
            </Box>
        </Box>
    );
};

export default UploadFile;
