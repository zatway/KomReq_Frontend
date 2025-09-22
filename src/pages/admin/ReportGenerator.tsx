import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Alert, Grid } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { generateRequestsReportPdf, generateRequestsReportExcel } from '../../api/reports'; // Imported as values
import type { ReportFilterDto } from '../../api/reports'; // Imported as type
import { getRequestStatuses } from '../../api/requests';
import { searchUsers } from '../../api/auth';
import { ROLES } from '../../constants/roles';
import type { SelectChangeEvent } from '@mui/material/Select';

interface StatusOption {
    id: number;
    name: string;
}

interface UserOption {
    id: string;
    userName: string;
    fullName?: string;
    email?: string;
}

const ReportGenerator: React.FC = () => {
    const [filter, setFilter] = useState<ReportFilterDto>({});
    const [requestStatuses, setRequestStatuses] = useState<StatusOption[]>([]);
    const [clientOptions, setClientOptions] = useState<UserOption[]>([]);
    const { execute, loading, error } = useApi();

    useEffect(() => {
        const fetchDependencies = async () => {
            const statuses = await execute(() => getRequestStatuses());
            if (statuses) {
                setRequestStatuses(statuses as StatusOption[]); // Cast to StatusOption[]
            }

            const clients = await execute(() => searchUsers(undefined, ROLES.Client));
            if (clients) {
                setClientOptions(clients as UserOption[]); // Cast to UserOption[]
            }
        };
        fetchDependencies();
    }, []);

    const handleFilterChange = (e: SelectChangeEvent<any> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name as string]: value === '' ? undefined : value,
        }));
    };

    const handleGeneratePdf = async () => {
        try {
            const blob = await execute(() => generateRequestsReportPdf(filter));
            if (blob) {
                const url = window.URL.createObjectURL(blob as Blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'requests-report.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleGenerateExcel = async () => {
        try {
            const blob = await execute(() => generateRequestsReportExcel(filter));
            if (blob) {
                const url = window.URL.createObjectURL(blob as Blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'requests-report.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Генерация отчетов по заявкам</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4} component="div"> {/* Re-added component="div" */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Статус</InputLabel>
                        <Select
                            name="statusId"
                            value={filter.statusId || ''}
                            onChange={handleFilterChange}
                            label="Статус"
                        >
                            <MenuItem value="">Все статусы</MenuItem>
                            {requestStatuses.map(status => (
                                <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} component="div"> {/* Re-added component="div" */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Приоритет</InputLabel>
                        <Select
                            name="priority"
                            value={filter.priority || ''}
                            onChange={handleFilterChange}
                            label="Приоритет"
                        >
                            <MenuItem value="">Все приоритеты</MenuItem>
                            <MenuItem value="Low">Низкий</MenuItem>
                            <MenuItem value="Medium">Средний</MenuItem>
                            <MenuItem value="High">Высокий</MenuItem>
                            <MenuItem value="Urgent">Срочный</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} component="div"> {/* Re-added component="div" */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Начальная дата"
                        type="date"
                        name="startDate"
                        InputLabelProps={{ shrink: true }}
                        value={filter.startDate || ''}
                        onChange={handleFilterChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} component="div"> {/* Re-added component="div" */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Конечная дата"
                        type="date"
                        name="endDate"
                        InputLabelProps={{ shrink: true }}
                        value={filter.endDate || ''}
                        onChange={handleFilterChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} component="div"> {/* Re-added component="div" */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Клиент</InputLabel>
                        <Select
                            name="clientUserId"
                            value={filter.clientUserId || ''}
                            onChange={handleFilterChange}
                            label="Клиент"
                        >
                            <MenuItem value="">Все клиенты</MenuItem>
                            {clientOptions.map(client => (
                                <MenuItem key={client.id} value={client.id}>
                                    {client.fullName || client.userName || client.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleGeneratePdf}
                    disabled={loading}
                >
                    {loading ? 'Генерация PDF...' : 'Сгенерировать PDF'}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleGenerateExcel}
                    disabled={loading}
                >
                    {loading ? 'Генерация Excel...' : 'Сгенерировать Excel'}
                </Button>
            </Box>
        </Box>
    );
};

export default ReportGenerator;
