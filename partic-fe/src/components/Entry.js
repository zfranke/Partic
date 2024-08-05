import React, { useState } from 'react';
import { Container, Card, CardHeader, CardContent,TextField, Button, Alert } from '@mui/material';
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
      console.log("Backend url " +process.env.REACT_APP_BACKEND_URL);
      console.log ("Hourly Rate " + process.env.REACT_APP_HOURLY_RATE);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-parkingTicket`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        })

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
            <h1>Get a Parking Ticket</h1>
            <Button variant="contained" color="primary" onClick={handleGetTicket}>Get Ticket</Button>
            {success && 
            <>
            <Alert severity="success">
                Your ticket has been successfully generated!
            </Alert>
            <div />
            <Card>
                <CardHeader title="Parking Ticket Info" />
                <CardContent>
                    <TextField
                        label="Ticket Number"
                        value={parkingTicket.ticketNumber}
                        disabled
                    />
                    <br />
                    <br />
                    <TextField
                        label="Entry Time"
                        value={parkingTicket.entryTime}
                        disabled
                    />
                    <br />
                    <br />
                    <TextField
                        label="Hourly Rate"
                        value={process.env.REACT_APP_HOURLY_RATE}
                        disabled
                    />
                    <br />
                    <br />
                    <TextField
                        label="Minimum Hours"
                        value="1"
                        disabled
                    />
                </CardContent>
            </Card>
            </>
            }
        </Container>
    );
}

export default Entry;