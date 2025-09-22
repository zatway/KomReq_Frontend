import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Alert } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { getAuditLogs } from '../../api';
import type { AuditLogDto, AuditLogFilter } from '../../api';
import { format } from 'date-fns';

const AuditLogViewer: React.FC = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
    const [filter, setFilter] = useState<AuditLogFilter>({});
    const { execute, loading, error } = useApi();
    // const { showMessage } = useSnackbar(); // showMessage is not used, useApi handles snackbar

    const fetchAuditLogs = async () => {
        const data = await execute(() => getAuditLogs(filter));
        if (data) {
            setAuditLogs(data as AuditLogDto[]);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, [filter]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value === '' ? undefined : value,
        }));
    };

    const handleDateFilterChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(prev => ({
            ...prev,
            [name]: value === '' ? undefined : value,
        }));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Журнал аудита</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    label="ID Пользователя"
                    name="userId"
                    value={filter.userId || ''}
                    onChange={handleFilterChange}
                    size="small"
                />
                <TextField
                    label="Действие"
                    name="action"
                    value={filter.action || ''}
                    onChange={handleFilterChange}
                    size="small"
                />
                <TextField
                    label="Начальная дата"
                    type="date"
                    name="startDate"
                    InputLabelProps={{ shrink: true }}
                    value={filter.startDate || ''}
                    onChange={handleDateFilterChange('startDate')}
                    size="small"
                />
                <TextField
                    label="Конечная дата"
                    type="date"
                    name="endDate"
                    InputLabelProps={{ shrink: true }}
                    value={filter.endDate || ''}
                    onChange={handleDateFilterChange('endDate')}
                    size="small"
                />
                <Button variant="contained" onClick={fetchAuditLogs} disabled={loading}>Применить фильтр</Button>
            </Box>

            {loading && <Typography>Загрузка логов...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Пользователь</TableCell>
                            <TableCell>Действие</TableCell>
                            <TableCell>Тип сущности</TableCell>
                            <TableCell>ID сущности</TableCell>
                            <TableCell>Детали</TableCell>
                            <TableCell>IP Адрес</TableCell>
                            <TableCell>Время</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {auditLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{log.id}</TableCell>
                                <TableCell>{log.userFullName || log.userName || log.userId}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.entityType}</TableCell>
                                <TableCell>{log.entityId}</TableCell>
                                <TableCell>{log.details}</TableCell>
                                <TableCell>{log.ipAddress}</TableCell>
                                <TableCell>{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuditLogViewer;
