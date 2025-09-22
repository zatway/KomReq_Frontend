import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from "../pages/admin/adminDashboard.tsx";
import UserManagement from "../pages/admin/userManagement.tsx";
import EquipmentTypeManagement from "../pages/admin/EquipmentTypeManagement.tsx";
import AuditLogViewer from "../pages/admin/AuditLogViewer.tsx";
import StatisticsDashboard from "../pages/admin/StatisticsDashboard.tsx";
import ReportGenerator from "../pages/admin/ReportGenerator.tsx";

export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/equipment-types" element={<EquipmentTypeManagement />} />
            <Route path="/audit-logs" element={<AuditLogViewer />} />
            <Route path="/statistics" element={<StatisticsDashboard />} />
            <Route path="/reports" element={<ReportGenerator />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};
