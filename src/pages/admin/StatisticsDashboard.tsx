import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper, Grid } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import type { StatusStatisticDto, StatusStatisticFilter } from '../../api'; // Changed to type-only import
import { getStatusStatistics } from '../../api';
// Removed: import { useSnackbar } from '../../contexts/snackbarContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsDashboard: React.FC = () => {
    const [statusStatistics, setStatusStatistics] = useState<StatusStatisticDto[]>([]);
    const [filter, setFilter] = useState<StatusStatisticFilter>({});
    const { execute, loading, error } = useApi();
    // Removed: const { showMessage } = useSnackbar(); // showMessage is not used, useApi handles snackbar

    const fetchStatusStatistics = async () => {
        const data = await execute(() => getStatusStatistics(filter));
        if (data) {
            setStatusStatistics(data as StatusStatisticDto[]);
        }
    };

    useEffect(() => {
        fetchStatusStatistics();
    }, [filter]);

    const handleDateFilterChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(prev => ({
            ...prev,
            [name]: value === '' ? undefined : value,
        }));
    };

    // Aggregate data for charts
    const aggregatedStatusData = statusStatistics.reduce((acc, curr) => {
        const existing = acc.find(item => item.statusName === curr.statusName);
        if (existing) {
            existing.countRequests += curr.countRequests;
        } else {
            acc.push({ statusName: curr.statusName, countRequests: curr.countRequests });
        }
        return acc;
    }, [] as { statusName: string; countRequests: number }[]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Панель аналитики</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
                <Button variant="contained" onClick={fetchStatusStatistics} disabled={loading}>Применить фильтр</Button>
            </Box>

            {loading && <Typography>Загрузка статистики...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6} component="div"> {/* Re-added component="div" */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Заявки по статусам</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={aggregatedStatusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="statusName" />
                                <YAxis />
                                <Tooltip />
                                <Legend /> {/* Reverted to original Legend usage */}
                                <Bar dataKey="countRequests" fill="#8884d8" name="Количество заявок" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                {/* Добавить больше графиков, например, динамику за период */}
            </Grid>
        </Box>
    );
};

export default StatisticsDashboard;
