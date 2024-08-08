import React, { useState } from 'react';
import { Container, Paper, Box, Typography, TextField, Button, Alert } from '@mui/material';

/*
* Exit component is responsible for exiting a parking ticket
*/
function Exit() {
    const [ticketNumber, setTicketNumber] = useState('');
    const [costInput, setCostInput] = useState('');
    const [success, setSuccess] = useState(false);
    const [paySuccess, setPaySuccess] = useState(false);
    const [parkingTicket, setParkingTicket] = useState(null);

    // Pay for the ticket
    const handlePayTicket = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pay-parkingTicket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketNumber: parkingTicket.ticketNumber,
                    amount: parseFloat(costInput),
                }),
            });

            if (response.ok) {
                const updatedTicket = await response.json();
                // Payment successful
                setParkingTicket(updatedTicket);
                setPaySuccess(true);
                setSuccess(false);
                setCostInput('');
            } else {
                // Handle error
                setPaySuccess(false);
            }
        } catch (error) {
            // Handle error
            setPaySuccess(false);
        }
    }

    // Search for the ticket
    const handleSearchTicket = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search-parkingTicket/${ticketNumber}`);
            if (response.ok) {
                const foundTicket = await response.json();
                setParkingTicket(foundTicket);
                setSuccess(true);
                setPaySuccess(false);
            } else {
                // Handle error
                setSuccess(false);
                setParkingTicket(null);
            }
        } catch (error) {
            // Handle error
            setSuccess(false);
            setParkingTicket(null);
        }
    }

    return (
        <>
            <Container>
                <Typography variant="h4" gutterBottom>Search for a Parking Ticket</Typography>
                <form onSubmit={handleSearchTicket}>
                    <TextField
                        label="Ticket Number"
                        variant="outlined"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">Search Ticket</Button>
                </form>
                {success && parkingTicket && (
                    <>
                        <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
                            <Typography variant="h6" gutterBottom>Parking Ticket Details</Typography>
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
                                    <Typography variant="body1">Exit Time:</Typography>
                                    <Typography variant="h6">{parkingTicket.exitTime}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1">Cost:</Typography>
                                    <Typography variant="h6">${parkingTicket.cost}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1">Balance:</Typography>
                                    <Typography variant="h6">${parkingTicket.balance}</Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Typography variant="h4" gutterBottom>Pay for Parking Ticket</Typography>
                        <form onSubmit={handlePayTicket}>
                            <TextField
                                label="Amount"
                                variant="outlined"
                                value={costInput}
                                onChange={(e) => setCostInput(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" color="primary">Pay</Button>
                        </form>
                    </>
                )}
            </Container>
            {paySuccess && parkingTicket && (
                <Container>
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Payment successful!
                    </Alert>

                    <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
                        <Typography variant="h6" gutterBottom>Parking Ticket Details</Typography>
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
                                <Typography variant="body1">Exit Time:</Typography>
                                <Typography variant="h6">{parkingTicket.exitTime}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">Cost:</Typography>
                                <Typography variant="h6">${parkingTicket.cost}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">Balance:</Typography>
                                <Typography variant="h6">${parkingTicket.balance}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            )}
        </>
    );
}

export default Exit;
