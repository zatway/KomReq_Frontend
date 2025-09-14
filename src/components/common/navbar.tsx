import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Request Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        component={NavLink}
                        to="/"
                        sx={({ isActive }) => ({
                            textDecoration: isActive ? 'underline' : 'none',
                        })}
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        component={NavLink}
                        to="/requests"
                        sx={({ isActive }) => ({
                            textDecoration: isActive ? 'underline' : 'none',
                        })}
                    >
                        Requests
                    </Button>
                    {user?.roles?.includes('Admin') && (
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/admin"
                            sx={({ isActive }) => ({
                                textDecoration: isActive ? 'underline' : 'none',
                            })}
                        >
                            Admin
                        </Button>
                    )}
                    {user ? (
                        <>
                            <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                                {user.userName}
                            </Typography>
                            <Button color="inherit" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            component={NavLink}
                            to="/login"
                            sx={({ isActive }) => ({
                                textDecoration: isActive ? 'underline' : 'none',
                            })}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
