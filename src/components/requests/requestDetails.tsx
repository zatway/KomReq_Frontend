import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableRow, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { getRequest, addComment } from '../../api';
import { getRequestStatuses, changeStatus } from '../../api/requests';
import type { RequestStatusDto } from '../../api/requests';
import { useApi } from '../../hooks/useApi';
import type { RequestDto } from '../../api/types/interfaces/requestDto';
import type { AddCommentDto } from '../../api/requests';
import {useAuth} from "../../hooks/useAuth.tsx";
import {ROLES} from '../../constants/roles';

const RequestDetails: React.FC = ({}) => {
    const { id } = useParams<{ id: string }>();
    const { data: request, execute, loading, error } = useApi<RequestDto>();
    const { execute: executeComment, loading: commentLoading } = useApi<{ message: string }>(); // Separate useApi for comments
    const { hasRole } = useAuth();
    const navigate = useNavigate();

    const [commentText, setCommentText] = useState<string>('');
    const [statuses, setStatuses] = useState<RequestStatusDto[]>([]);
    const { execute: execStatuses } = useApi<RequestStatusDto[]>();
    const { execute: execChangeStatus, loading: statusLoading } = useApi<{ message: string }>();

    const fetchRequestDetails = () => {
        if (id) {
            execute(() => getRequest(Number(id)));
        }
    };

    useEffect(() => {
        fetchRequestDetails();
    }, [id]);

    useEffect(() => {
        const loadStatuses = async () => {
            const res = await execStatuses(() => getRequestStatuses());
            if (res) setStatuses(res);
        };
        loadStatuses();
    }, []);

    const handleChangeStatus = async (newStatusId: number) => {
        if (!id) return;
        await execChangeStatus(() => changeStatus(Number(id), { newStatusId }), 'Статус обновлён');
        fetchRequestDetails();
    };

    const handleAddComment = async () => {
        if (!commentText.trim() || !id) return;

        try {
            const commentDto: AddCommentDto = { comment: commentText };
            await executeComment(() => addComment(Number(id), commentDto), 'Комментарий добавлен'); // Use executeComment
            setCommentText('');
            fetchRequestDetails();
        } catch (err: any) {
            console.error("Ошибка при добавлении комментария:", err);
            // Error handling is managed by useApi and snackbarContext
        }
    };

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!request) return <Typography>Заявка не найдена</Typography>;

    const canAddComment = hasRole(ROLES.Manager) || hasRole(ROLES.Technician) || hasRole(ROLES.Client);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Детали заявки #{request.id}
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Создатель</TableCell>
                            <TableCell>{request.creator?.fullName ?? request.creator?.userName ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Оборудование</TableCell>
                            <TableCell>{request.equipmentType?.equipmentName}</TableCell>
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
                            <TableCell>
                                {(hasRole(ROLES.Manager) || hasRole(ROLES.Technician)) ? (
                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                        <InputLabel id="status-select-label">Статус</InputLabel>
                                        <Select
                                            labelId="status-select-label"
                                            label="Статус"
                                            value={request.currentStatusId ?? statuses.find(s => s.name === request.currentStatus?.name)?.id ?? ''}
                                            onChange={(e) => handleChangeStatus(Number(e.target.value))}
                                            disabled={statusLoading}
                                        >
                                            {statuses.map(s => (
                                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <>{request.currentStatus?.name ?? request.currentStatusId}</>
                                )}
                            </TableCell>
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
                {(hasRole(ROLES.Manager) || hasRole(ROLES.Technician) || hasRole(ROLES.Client)) && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        {hasRole(ROLES.Manager) && <Button variant="contained" onClick={() => navigate(`/requests/${id}/edit`)}>Редактировать</Button>}
                        <Button variant="contained" onClick={() => navigate(`/requests/${id}/history`)}>История</Button>
                        {hasRole(ROLES.Manager) && <Button variant="contained" onClick={() => navigate(`/requests/${id}/assign`)}>Назначить</Button>}
                        {(hasRole(ROLES.Manager) || hasRole(ROLES.Technician)) && <Button variant="contained" onClick={() => navigate(`/requests/${id}/upload`)}>Загрузить файл</Button>}
                    </Box>
                )}
            </Paper>

            {canAddComment && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Добавить комментарий</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Введите ваш комментарий..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        sx={{ mb: 2 }}
                        disabled={commentLoading}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddComment}
                        disabled={commentLoading || !commentText.trim()}
                    >
                        {commentLoading ? 'Добавление...' : 'Добавить комментарий'}
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

export default RequestDetails;
