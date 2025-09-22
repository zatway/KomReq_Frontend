import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Table, TableHead, TableBody, TableRow, TableCell, Alert } from '@mui/material';
import { getRequestHistory } from '../../api';
import { useApi } from '../../hooks/useApi';
import type { RequestHistoryDto } from '../../api/types/interfaces/requestHistoryDto';

const RequestHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: history, execute, loading, error } = useApi<RequestHistoryDto[]>();

    useEffect(() => {
        if (id) {
            execute(() => getRequestHistory(Number(id)));
        }
    }, [id, execute]);

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                История заявки #{id}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Дата изменения</TableCell>
                        <TableCell>Старый статус</TableCell>
                        <TableCell>Новый статус</TableCell>
                        <TableCell>Комментарий</TableCell>
                        <TableCell>Изменено пользователем</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {history?.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>{new Date(entry.changeDate).toLocaleString()}</TableCell>
                            <TableCell>{entry.oldStatus?.statusName || '-'}</TableCell>
                            <TableCell>{entry.newStatus?.statusName || '-'}</TableCell>
                            <TableCell>{entry.comment || '-'}</TableCell>
                            <TableCell>{entry.changedBy?.fullName || entry.changedBy?.id || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default RequestHistory;
