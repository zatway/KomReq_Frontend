import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from "../pages/admin/adminDashboard.tsx";
import UserManagement from "../pages/admin/userManagement.tsx";
import EquipmentTypeManagement from "../pages/admin/EquipmentTypeManagement.tsx";
import AuditLogViewer from "../pages/admin/AuditLogViewer.tsx";
import StatisticsDashboard from "../pages/admin/StatisticsDashboard.tsx";
import ReportGenerator from "../pages/admin/ReportGenerator.tsx";
import { useAuth } from '../hooks/useAuth.tsx';
import { ROLES } from '../constants/roles';

export const AdminRoutes = () => {
  const { hasRole } = useAuth();
  const canAdmin = hasRole(ROLES.Admin);
  const canManager = hasRole(ROLES.Manager);

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      {canAdmin ? (
        <Route path="/users" element={<UserManagement />} />
      ) : (
        <Route path="/users" element={<Navigate to="/admin" replace />} />
      )}
      {canAdmin ? (
        <Route path="/equipment-types" element={<EquipmentTypeManagement />} />
      ) : (
        <Route path="/equipment-types" element={<Navigate to="/admin" replace />} />
      )}
      {canAdmin ? (
        <Route path="/audit-logs" element={<AuditLogViewer />} />
      ) : (
        <Route path="/audit-logs" element={<Navigate to="/admin" replace />} />
      )}
      {canAdmin || canManager ? (
        <Route path="/statistics" element={<StatisticsDashboard />} />
      ) : (
        <Route path="/statistics" element={<Navigate to="/admin" replace />} />
      )}
      {canAdmin || canManager ? (
        <Route path="/reports" element={<ReportGenerator />} />
      ) : (
        <Route path="/reports" element={<Navigate to="/admin" replace />} />
      )}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};
