import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';
import { Home } from '../pages/Home';
import { RequestsPage } from '../pages/RequestsPage';
import { RequestPage } from '../pages/RequestPage';
import { AdminRoutes } from './AdminRoutes';
import { Layout } from '../components/common/Layout';

export const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />

            {/* Protected Routes */}
            <Route
                element={
                    user ? <Layout /> : <Navigate to="/login" replace />
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/requests/:id" element={<RequestPage />} />
                <Route
                    path="/admin/*"
                    element={
                        user?.roles?.includes('Admin') ? (
                            <AdminRoutes />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
