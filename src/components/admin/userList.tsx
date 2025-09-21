import React, {useEffect} from 'react';
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
    Backdrop
} from '@mui/material';
import {getUsers, deleteUser, changeRole} from '../../api';
import {useApi} from '../../hooks/useApi';
import type {UserDto} from '../../api/types/interfaces/userDto';
import {useAuth} from "../../hooks/useAuth.tsx";

const UserList: React.FC = () => {
    const {data: users, execute, loading, error} = useApi<UserDto[]>();
    const {hasRole} = useAuth();

    useEffect(() => {
        if (hasRole('Admin')) {
            execute(() => getUsers());
        }
    }, [execute, hasRole]);

    const handleDelete = async (id: string) => {
        await execute(async () => {
            await deleteUser(id);
            return []
        });
        await execute(() => getUsers());
    };

    const handleChangeRole = async (id: string, newRole: string) => {
        await execute(async () => {
            await changeRole({userId: id, newRole});
            return []
        });
        execute(() => getUsers());
    };

    if (!hasRole('Admin')) {
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
                    {users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.roles?.values?.join(', ')}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => handleChangeRole(user.id, user.roles?.values?.includes('Admin') ? 'Manager' : 'Admin')}
                                >
                                    Изменить роль
                                </Button>
                                <Button color="error" onClick={() => handleDelete(user.id)}>
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
