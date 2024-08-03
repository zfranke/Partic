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
    const [pay, setPay] = useState(false);
    const {paySuccess, setPaySuccess} = useState(false);

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
        // Parking ticket exited successfully
        setParkingTicket('');
        setSuccess(true);
        setCost(parkingTicket.cost);
        setPay(true);
        }
        else {
        // Handle error
        setSuccess(false);
        }
    }
    catch (error) {
        // Handle error
        setSuccess(false);
    }
    }

    //Pay for the ticket
    const handlePayTicket = async(e) => {
        e.preventDefault();

        // Get the ticket number and amount from the user and process the payment
        try {
            const response = await fetch(`${process.env.backend_url}/api/pay-parkingTicket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parkingTicket: parkingTicket,
                    cost: cost,
                }),
            })

            if (response.ok) {
                // Payment successful
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
        <>
        <Navigation />
            <Container>
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
                    Your cost is: {parkingTicket.cost}
                    Hourly fee is ${process.env.hourly_rate}, 1 hour minimum
                </Alert>}
            </Container>

            {pay && <Container>
                <h1>Pay for Parking Ticket</h1>
                <TextField
                    label="Ticket Number"
                    variant="outlined"
                    value={parkingTicket.ticketNumber}
                    onChange={(e) => setParkingTicket(e.target.value)}
                />
                <TextField
                    label="Amount"
                    variant="outlined"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handlePayTicket}>Pay Ticket</Button>
                {paySuccess && <Alert severity="success">
                    Payment successful!
                </Alert>}
            </Container>}
            
        </>
    );
}

export default Exit;
