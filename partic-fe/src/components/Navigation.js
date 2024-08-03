import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, CssBaseline } from '@mui/material';

function Navigation() {
    const [loggedIn, setLoggedIn] = useState(() => checkLoggedIn());

    useEffect(() => {
        setLoggedIn(checkLoggedIn());
    }, []);

    // Check if the user is logged in
    function checkLoggedIn() {
        return !!localStorage.getItem('token');
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem('token');
        setLoggedIn(false);
        // Refresh the page
        window.location.reload();
    }

    return (
        <AppBar position="static" sx={{ marginBottom: '25px' }}>
            <CssBaseline />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Partic - Parking Ticket System
                </Typography>
                <Button color="inherit" component={Link} to="/admin">Admin</Button>
                <Button color="inherit" component={Link} to="/">Form</Button>
                {/* Conditional rendering based on login status */}
                {loggedIn ? (
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
