import React, { useState, useEffect }  from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fab, useMediaQuery, Button, Grid, Container, Typography, List, ListItem, ListItemText, Box, Paper, Divider,  Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // "+" 아이콘
import '../App.css';

export default function CompetitionPage() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const userRole = localStorage.getItem('role');

  const handleCreateRoom = () => {
    if (userRole === 'ADMIN') {
      navigate('/create-chatroom'); // 채팅방 생성 페이지로 네비게이션
    } else {
      setOpenDialog(true); // 권한 없음 다이얼로그 표시
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

    return (
      <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minheight: '75vh', padding: '10px' }}>
        <Paper>
          <Typography variant="h6" component="h1" gutterBottom align="left" style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
            대회
          </Typography>
        </Paper>
        <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={handleCreateRoom}>
        <AddIcon />
      </Fab>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>접근 제한</DialogTitle>
        <DialogContent>
          <DialogContentText>
            권한이 없습니다
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    );
  }