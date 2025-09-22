import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/loginPage';
import RegisterPage from '../pages/registerPage';
import RequestList from '../components/requests/requestList';
import RequestForm from '../components/requests/requestForm';
import RequestPage from '../pages/requestPage';
import ChangePasswordPage from '../pages/changePasswordPage';
import Home from '../pages/home';
import {AdminRoutes} from './adminRoutes';
import Layout from '../components/common/layout';
import AssignUser from '../components/requests/assignUser';
import UploadFile from '../components/requests/uploadFile';
import RequestHistory from '../components/requests/requestHistory';
import NotificationsViewer from '../pages/NotificationsViewer';
import {useAuth} from "../hooks/useAuth.tsx";

const AppRoutes: React.FC = () => {
    const { isAuthenticated, hasRole } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Layout>
                            <Home />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/requests"
                element={
                    isAuthenticated ? (
                        <Layout>
                            <RequestList />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/requests/new"
                element={
                    isAuthenticated && hasRole('Manager') ? (
                        <Layout>
                            <RequestForm />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/requests/:id"
                element={
                    isAuthenticated ? (
                        <Layout>
                            <RequestPage />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/requests/:id/edit"
                element={
                    isAuthenticated && hasRole('Manager') ? (
                        <Layout>
                            <RequestForm />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/requests/:id/history"
                element={
                    isAuthenticated ? (
                        <Layout>
                            <RequestHistory />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/requests/:id/assign"
                element={
                    isAuthenticated && hasRole('Manager') ? (
                        <Layout>
                            <AssignUser />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/requests/:id/upload"
                element={
                    isAuthenticated && (hasRole('Manager') || hasRole('Technician')) ? (
                        <Layout>
                            <UploadFile />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/change-password"
                element={
                    isAuthenticated ? (
                        <Layout>
                            <ChangePasswordPage />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/notifications"
                element={
                    isAuthenticated ? (
                        <Layout>
                            <NotificationsViewer />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/admin/*"
                element={
                    isAuthenticated && hasRole('Admin') ? (
                        <Layout>
                            <AdminRoutes />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
        </Routes>
    );
};

export default AppRoutes;
