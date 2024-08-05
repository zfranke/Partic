import React, { useState } from 'react';
import { Container, Card, CardHeader, CardContent,TextField, Button, Alert } from '@mui/material';
import Navigation from './Navigation';


/*
* Exit component is responsible for exiting a parking ticket
*/
function Exit() {
    const [parkingTicket, setParkingTicket] = useState('');
    const [costInput, setCostInput] = useState('');
    const [success, setSuccess] = useState(false);
    const [pay, setPay] = useState(false);
    const {paySuccess, setPaySuccess} = useState(false);

    //User clicks a big button and exits a parking ticket
    const handleExitTicket = async(e) => {
        e.preventDefault();

    // Get the ticket number from the user and calculate the cost based on entry time and exit time which is when the ticket is sent
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/exit-parkingTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketNumber: parkingTicket,
        }),
        })

        if (response.ok) {
        // Parking ticket exited successfully
        const parkingTicket = await response.json();
        setParkingTicket(parkingTicket);
        setSuccess(true);
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pay-parkingTicket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketNumber: parkingTicket.ticketNumber,
                    amount: costInput,
                }),
            })

            if (response.ok) {
                const parkingTicket = await response.json();
                // Payment successful
                setParkingTicket(parkingTicket);
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
            <Container>
                <h1>Exit a Parking Ticket</h1>
                <TextField
                    label="Ticket Number"
                    variant="outlined"
                    value={parkingTicket.ticketNumber}
                    onChange={(e) => setParkingTicket(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleExitTicket}>Exit Ticket</Button>
                {success && 
                <>
                <Alert severity="success">
                    Ticket Found
                </Alert>

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
                            label="Exit Time"
                            value={parkingTicket.exitTime}
                            disabled
                        />
                        <br />
                        <br />
                        <TextField
                            label="Cost"
                            value={parkingTicket.cost}
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
                    value={costInput}
                    onChange={(e) => setCostInput(e.target.value)}
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
