import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Button,
    TextField,
    Typography,
    Container,
    Box,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import {register} from '../api';
import {useApi} from '../hooks/useApi';

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({userName: '', fullName: '', email: '', password: '', roles: ['Client'] as string[]});
    const {execute, error, loading} = useApi();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name as string]: e.target.value});
    };

    const handleRolesChange = (e: any) => {
        const value = e.target.value as string[];
        setForm({...form, roles: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await execute(() => register(form), 'Пользователь создан');
            navigate('/login');
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h4" gutterBottom>
                    Регистрация
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
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
                        label="Полное имя"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Роли</InputLabel>
                        <Select multiple value={form.roles} onChange={handleRolesChange} renderValue={(selected) => (selected as string[]).join(', ')}>
                            <MenuItem value="Client">Клиент</MenuItem>
                            <MenuItem value="Manager">Менеджер</MenuItem>
                            <MenuItem value="Technician">Техник</MenuItem>
                            <MenuItem value="Admin">Администратор</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/login')}
                    >
                        Уже есть аккаунт? Войти
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
