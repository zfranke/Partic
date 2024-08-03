import React, { useState } from 'react';
import { Container, TextField, Button, Alert } from '@mui/material';
import Navigation from './Navigation';

/*
* Entry component is responsible for getting a parking ticket
*/
function Entry() {
    const [parkingTicket, setParkingTicket] = useState('');
    const [success, setSuccess] = useState(false);

    //User clicks a big button and gets back a parking ticket
    const handleGetTicket = async(e) => {
        e.preventDefault();

    try {
      const response = await fetch(`${process.env.backend_url}/api/get-parkingTicket`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        })

        if (response.ok) {
        // Suggestion submitted successfully
        setParkingTicket('');
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
            <h1>Get a Parking Ticket</h1>
            <Button variant="contained" color="primary" onClick={handleGetTicket}>Get Ticket</Button>
            {success && <Alert severity="success">
                Your parking ticket is: {parkingTicket.ticketNumber}
                Your entry time is: {parkingTicket.entryTime}
                Hourly fee is $5.00, 1 hour minimum
            </Alert>}
        </Container>
    );
}

export default Entry;