import { Routes, Route, Navigate } from 'react-router-dom';

export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};
