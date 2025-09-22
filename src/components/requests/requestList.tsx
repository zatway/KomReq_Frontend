import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Alert
} from '@mui/material';
import {getRequests, deleteRequest} from '../../api';
import {useApi} from '../../hooks/useApi';
import type {RequestFilterDto} from '../../api/types/interfaces/requestFilterDto';
import type {RequestDto} from '../../api/types/interfaces/requestDto';
import {useAuth} from "../../hooks/useAuth.tsx";

const RequestList: React.FC = () => {
    const [filter, setFilter] = useState<RequestFilterDto>({});
    const {data: requests, execute, error} = useApi<RequestDto[]>();
    const {execute: execDelete} = useApi<{ message: string }>();
    const {hasRole} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        execute(() => getRequests(filter));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({...filter, [e.target.name as string]: e.target.value});
    };

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h5" gutterBottom>
                Список заявок
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{mb: 2, display: 'flex', gap: 2}}>
                {/* <TextField */}
                {/*    label="ID клиента" */}
                {/*    name="clientId" */}
                {/*    type="number" */}
                {/*    value={filter.clientId || ''} */}
                {/*    onChange={handleFilterChange} */}
                {/* /> */}
                <FormControl sx={{minWidth: 120}}>
                    <InputLabel>Приоритет</InputLabel>
                    <Select name="priority" value={filter.priority || ''} onChange={(ev) => setFilter({...filter, priority: ev.target.value as string})}>
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="Low">Низкий</MenuItem>
                        <MenuItem value="Medium">Средний</MenuItem>
                        <MenuItem value="High">Высокий</MenuItem>
                        <MenuItem value="Urgent">Срочный</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Дата начала"
                    name="startDate"
                    type="date"
                    InputLabelProps={{shrink: true}}
                    value={filter.startDate || ''}
                    onChange={handleFilterChange}
                />
                <TextField
                    label="Дата окончания"
                    name="endDate"
                    type="date"
                    InputLabelProps={{shrink: true}}
                    value={filter.endDate || ''}
                    onChange={handleFilterChange}
                />
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Создатель</TableCell> {/* Изменено с Клиент на Создатель */}
                        <TableCell>Оборудование</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Приоритет</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(requests) && requests.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell>{request.id}</TableCell>
                            <TableCell>{request.creator?.fullName || request.creator?.userName}</TableCell> {/* Изменено с request.client на request.creator */}
                            <TableCell>{request.equipmentType?.equipmentName}</TableCell> {/* Changed to equipmentName */}
                            <TableCell>{request.currentStatus?.name}</TableCell>
                            <TableCell>{request.priority}</TableCell>
                            <TableCell>
                                <Button onClick={() => navigate(`/requests/${request.id}`)}>Подробно</Button>
                                {hasRole('Admin') && (
                                    <Button color="error"
                                            onClick={async () => {
                                                await execDelete(() => deleteRequest(request.id), 'Заявка удалена');
                                                await execute(() => getRequests(filter));
                                            }}>
                                        Удалить
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {hasRole('Manager') && (
                <Button
                    variant="contained"
                    sx={{mt: 2}}
                    onClick={() => navigate('/requests/new')}
                >
                    Создать заявку
                </Button>
            )}
        </Box>
    );
};

export default RequestList;
