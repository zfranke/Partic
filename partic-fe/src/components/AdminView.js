import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import Navigation from './Navigation';

const AdminView = () => {
  const [parkingTickets, setParkingTickets] = useState([]);

  useEffect(() => {
    // Fetch suggestions from the backend
    const token = localStorage.getItem('token'); // Get the authentication token from local storage

    fetch(`${process.env.backend_url}/api/get-tickets`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setParkingTickets(data);
    })
    .catch(error => {
      console.error('Error fetching tickets:', error);
    });
  }, []);

  const handleDeleteClick = (ticketId) => {
    // Delete suggestion from the backend
    const token = localStorage.getItem('token'); // Get the authentication token from local storage

    fetch(`${process.env.backend_url}/api/delete-ticket/${ticketId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Parking Ticket deleted:', data);
      // Update the list of suggestions by removing the deleted suggestion
      setParkingTickets(prevParkingTickets => prevParkingTickets.filter(parkingTicket => parkingTicket.id !== ticketId));
    })
    .catch(error => {
      console.error('Error deleting parking ticket:', error);
    });
  };

  return (
    <>
      <Navigation />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Admin View - Manage Parking Tickets
        </Typography>
        <List>
          {parkingTickets.map(parkingTicket => (
            <ListItem key={parkingTicket.id}>
              <ListItemText primary={parkingTicket.ticketNumber} />
              <ListItemText primary={parkingTicket.entryTime} />
              <ListItemText primary={parkingTicket.exitTime} />
              <ListItemText primary={parkingTicket.amount} />
              <ListItemText primary={parkingTicket.paymentStatus} />

              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteClick(parkingTicket.id)}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default AdminView;
