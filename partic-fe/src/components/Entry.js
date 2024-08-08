import React, { useState } from 'react';
import { Container, Paper, Box, Typography, Button, Alert } from '@mui/material';
import Navigation from './Navigation';

/*
* Entry component is responsible for getting a parking ticket
*/
function Entry() {
    const [parkingTicket, setParkingTicket] = useState(null);
    const [success, setSuccess] = useState(false);

    //User clicks a big button and gets back a parking ticket
    const handleGetTicket = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-parkingTicket`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Suggestion submitted successfully
                const ticketData = await response.json();
                setParkingTicket(ticketData);
                setSuccess(true);
            } else {
                // Handle error
                setSuccess(false);
            }
        } catch (error) {
            // Handle error
            setSuccess(false);
        }
    };

    return (
        <Container>
            <Navigation />

            <Typography variant="h4" gutterBottom>Get a Parking Ticket</Typography>
            <Button variant="contained" color="primary" onClick={handleGetTicket}>Get Ticket</Button>
            {success && parkingTicket && (
                <>
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Your ticket has been successfully generated!
                    </Alert>
                    <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
                        <Typography variant="h6" gutterBottom>Parking Ticket Info</Typography>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">Ticket Number:</Typography>
                                <Typography variant="h6">{parkingTicket.ticketNumber}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">Entry Time:</Typography>
                                <Typography variant="h6">{parkingTicket.entryTime}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">Hourly Rate:</Typography>
                                <Typography variant="h6">${process.env.REACT_APP_HOURLY_RATE}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1">Minimum Hours:</Typography>
                                <Typography variant="h6">1</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </>
            )}
            <br />
        </Container>
    );
}

export default Entry;
