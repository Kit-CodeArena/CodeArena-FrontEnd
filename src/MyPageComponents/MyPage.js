import React, { useState, useEffect }  from 'react';
import {  Button, Grid, Container, Typography, List, ListItem, ListItemText, Box, Paper, Divider,  Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function MyPage() {

    return (
      <Container component="main" maxWidth="md" style={{ maxHeight: '80vh', paddingTop: '10px' }}>
        <Paper>
          <Typography variant="h6" component="h1" gutterBottom align="left" style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
            마이 페이지
          </Typography>
        </Paper>
      </Container>
    );
  }