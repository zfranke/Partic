import React, { useState } from 'react';
import { Container, TextField, Button, Alert } from '@mui/material';
import Navigation from './Navigation';


/*
* Exit component is responsible for exiting a parking ticket
*/
function Exit() {
    const [parkingTicket, setParkingTicket] = useState('');
    const [cost, setCost] = useState('');
    const [success, setSuccess] = useState(false);

    //User clicks a big button and exits a parking ticket
    const handleExitTicket = async(e) => {
        e.preventDefault();

    // Get the ticket number from the user and calculate the cost based on entry time and exit time which is when the ticket is sent
    try {
      const response = await fetch(`${process.env.backend_url}/api/exit-parkingTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parkingTicket: parkingTicket,
        }),
        })

        if (response.ok) {
        // Suggestion submitted successfully
        setParkingTicket('');
        setCost('');
        setSuccess(true);
      } else {
        // Handle error
        setSuccess(false);
      }
    } catch (error) {
      // Handle error
        setSuccess(false);
    }
    }

    return (
        <Container>
            <Navigation />
            <h1>Exit a Parking Ticket</h1>
            <TextField
                label="Ticket Number"
                variant="outlined"
                value={parkingTicket.ticketNumber}
                onChange={(e) => setParkingTicket(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleExitTicket}>Exit Ticket</Button>
            {success && <Alert severity="success">
                Your parking ticket is: {parkingTicket.ticketNumber}
                Your entry time is: {parkingTicket.entryTime}
                Your exit time is: {parkingTicket.exitTime}
                Your cost is: {cost}
            </Alert>}
        </Container>
    );
}

export default Exit;
