import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { getRequest } from '../../api';
import { useApi } from '../../hooks/useApi';
import type { RequestDto } from '../../api/types/interfaces/requestDto';
import {useAuth} from "../../hooks/useAuth.tsx";
import {ROLES} from '../../constants/roles';

const RequestDetails: React.FC = ({}) => {
    const { id } = useParams<{ id: string }>();
    const { data: request, execute, loading, error } = useApi<RequestDto>();
    const { hasRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            execute(() => getRequest(Number(id)));
        }
    }, [id, execute]);

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!request) return <Typography>Заявка не найдена</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Детали заявки #{request.id}
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Клиент</TableCell>
                            <TableCell>{request.client?.fullName ?? request.clientId}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Оборудование</TableCell>
                            <TableCell>{request.equipmentType?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Количество</TableCell>
                            <TableCell>{request.quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Приоритет</TableCell>
                            <TableCell>{request.priority}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Статус</TableCell>
                            <TableCell>{request.currentStatus?.name ?? request.currentStatusId}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>{request.createdDate ? new Date(request.createdDate).toLocaleDateString() : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Целевая дата завершения</TableCell>
                            <TableCell>{request.targetCompletion ? new Date(request.targetCompletion).toLocaleDateString() : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Комментарии</TableCell>
                            <TableCell>{request.comments || '-'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {(hasRole(ROLES.Manager) || hasRole(ROLES.Technician)) && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        {hasRole(ROLES.Manager) && <Button variant="contained" onClick={() => navigate(`/requests/${id}/edit`)}>Редактировать</Button>}
                        <Button variant="contained" onClick={() => navigate(`/requests/${id}/history`)}>История</Button>
                        {hasRole(ROLES.Manager) && <Button variant="contained" onClick={() => navigate(`/requests/${id}/assign`)}>Назначить</Button>}
                        <Button variant="contained" onClick={() => navigate(`/requests/${id}/upload`)}>Загрузить файл</Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default RequestDetails;
