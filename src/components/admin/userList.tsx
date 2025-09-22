import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Box,
    Typography,
    Alert,
    Backdrop,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {getUsers, deleteUser, changeRole} from '../../api';
import {useApi} from '../../hooks/useApi';
import type {UserDto} from '../../api/types/interfaces/userDto';
import {useAuth} from "../../hooks/useAuth.tsx";
import {ROLES} from '../../constants/roles';

const allRoles = [ROLES.Client, ROLES.Manager, ROLES.Technician, ROLES.Admin];

const UserList: React.FC = () => {
    const {data: users, execute, loading, error} = useApi<UserDto[]>();
    const {hasRole} = useAuth();

    const [editedRoles, setEditedRoles] = useState<Record<string, string[]>>({});

    const isAdmin = hasRole(ROLES.Admin);
    useEffect(() => {
        if (isAdmin) {
            execute(() => getUsers());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    useEffect(() => {
        const initial: Record<string, string[]> = {};
        if(users !== null && users !== undefined) {
            console.log(users);
            users?.forEach(u => {
                const roles = u.roles ?? []; // Упрощено: roles уже должен быть string[]
                initial[u.id] = Array.isArray(roles) ? roles : [];
            });
            setEditedRoles(initial);
        }
    }, [users]);

    const handleDelete = async (id: string) => {
        await execute(async () => {
            await deleteUser(id);
            return []
        }, 'Пользователь удалён');
        await execute(() => getUsers());
    };

    const handleSaveRoles = async (id: string) => {
        const newRoles = editedRoles[id] || [];
        await execute(async () => {
            await changeRole({userId: id, newRoles});
            return []
        }, 'Роли обновлены');
        await execute(() => getUsers());
    };

    const handleChangeRoles = (id: string, value: string[]) => {
        setEditedRoles(prev => ({...prev, [id]: value}));
    };

    if (!isAdmin) {
        return <Typography>Доступ запрещён</Typography>;
    }

    return (
        <Box sx={{p: 3}}>
            <Backdrop open={loading}/>
            <Typography variant="h5" gutterBottom>
                Управление пользователями
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Имя</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Роли</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(users) && users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Роли</InputLabel>
                                    <Select
                                        multiple
                                        value={editedRoles[user.id] || []}
                                        label="Роли"
                                        onChange={(e) => handleChangeRoles(user.id, e.target.value as string[])}
                                        renderValue={(selected) => (selected as string[]).join(', ')}
                                    >
                                        {allRoles.map(r => (
                                            <MenuItem key={r} value={r}>{r}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" size="small" sx={{mr: 1}} onClick={() => handleSaveRoles(user.id)}>Сохранить</Button>
                                <Button color="error" size="small" onClick={() => handleDelete(user.id)}>
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default UserList;
