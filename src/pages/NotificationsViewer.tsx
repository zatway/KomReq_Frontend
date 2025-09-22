import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert } from '@mui/material';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, type NotificationDto } from '../api';
import { format } from 'date-fns';
import {useApi} from "../hooks/useApi.ts";
import {useSnackbar} from "../contexts/snackbarContext.tsx";

const NotificationsViewer: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const { execute, loading, error } = useApi();
    const { showMessage } = useSnackbar(); // Changed to showMessage

    const fetchNotifications = async () => {
        const data = await execute(() => getMyNotifications());
        if (data) {
            setNotifications(data as NotificationDto[]);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: number) => {
        try {
            await execute(() => markNotificationAsRead(id));
            showMessage('Уведомление отмечено как прочитанное', 'success'); // Changed to showMessage
            fetchNotifications();
        } catch (err: any) {
            showMessage(error || 'Ошибка при отметке уведомления как прочитанного', 'error'); // Changed to showMessage
            console.error(err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await execute(() => markAllNotificationsAsRead());
            showMessage('Все уведомления отмечены как прочитанные', 'success'); // Changed to showMessage
            fetchNotifications();
        } catch (err: any) {
            showMessage(error || 'Ошибка при отметке всех уведомлений как прочитанных', 'error'); // Changed to showMessage
            console.error(err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Мои уведомления</Typography>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleMarkAllAsRead}
                    disabled={loading || notifications.every(n => n.isRead)}
                >
                    Отметить все как прочитанные
                </Button>
            </Box>

            {loading && <Typography>Загрузка уведомлений...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Заявка ID</TableCell>
                            <TableCell>Сообщение</TableCell>
                            <TableCell>Дата отправки</TableCell>
                            <TableCell>Прочитано</TableCell>
                            <TableCell align="right">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications.map((notification) => (
                            <TableRow key={notification.id} sx={{ backgroundColor: notification.isRead ? '#f5f5f5' : '#e3f2fd' }}>
                                <TableCell>{notification.id}</TableCell>
                                <TableCell>{notification.requestId}</TableCell>
                                <TableCell>{notification.message}</TableCell>
                                <TableCell>{format(new Date(notification.sentDate), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                                <TableCell>{notification.isRead ? 'Да' : 'Нет'}</TableCell>
                                <TableCell align="right">
                                    {!notification.isRead && (
                                        <IconButton onClick={() => handleMarkAsRead(notification.id)} color="primary">
                                            <CheckCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default NotificationsViewer;
