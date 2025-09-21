import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { getRequest } from '../../api';
import { useApi } from '../../hooks/useApi';
import type { RequestDto } from '../../api/types/interfaces/requestDto';
import {useAuth} from "../../hooks/useAuth.tsx";

const RequestDetails: React.FC = ({}) => {
    const { id } = useParams<{ id: string }>();
    const { data: request, execute, loading, error } = useApi<RequestDto>();
    const { hasRole } = useAuth();

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
                            <TableCell>{request.clientId} ({request.clientId})</TableCell>
                        </TableRow>
                        {/*<TableRow>*/}
                        {/*    <TableCell>Оборудование</TableCell>*/}
                        {/*    <TableCell>{request..name}</TableCell>*/}
                        {/*</TableRow>*/}
                        <TableRow>
                            <TableCell>Количество</TableCell>
                            <TableCell>{request.quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Приоритет</TableCell>
                            <TableCell>{request.priority}</TableCell>
                        </TableRow>
                        {/*<TableRow>*/}
                        {/*    <TableCell>Статус</TableCell>*/}
                        {/*    <TableCell>{request.currentStatus.name}</TableCell>*/}
                        {/*</TableRow>*/}
                        <TableRow>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>{new Date(request.createdDate).toLocaleDateString()}</TableCell>
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
                {(hasRole('Manager') || hasRole('Technician')) && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        {hasRole('Manager') && <Button variant="contained" href={`/requests/${id}/edit`}>Редактировать</Button>}
                        <Button variant="contained" href={`/requests/${id}/history`}>История</Button>
                        <Button variant="contained" href={`/requests/${id}/assign`}>Назначить</Button>
                        <Button variant="contained" href={`/requests/${id}/upload`}>Загрузить файл</Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default RequestDetails;
