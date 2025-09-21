import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from "../pages/admin/adminDashboard.tsx";
import UserManagement from "../pages/admin/userManagement.tsx";

export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};
