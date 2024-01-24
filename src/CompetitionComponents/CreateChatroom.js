import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogActions, Container, Paper, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreateCompetitionRoom() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [maxUserNum, setMaxUserNum] = useState(10);
  const [tag, setTag] = useState('COMPETITION');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // 다이얼로그 상태

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/competition'); // 다이얼로그 닫을 때 경로 이동
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/test/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: roomName,
          maxUserNum: maxUserNum,
          tag: tag
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '정의되지 않은 오류');
        return;
      }

      setOpenDialog(true); // 성공시 다이얼로그 열기

    } catch (error) {
      setError('네트워크 오류');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>채팅방 생성</Typography>
        <TextField
          fullWidth
          label="채팅방 이름"
          margin="normal"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <TextField
          fullWidth
          label="최대 사용자 수"
          margin="normal"
          type="number"
          value={maxUserNum}
          onChange={(e) => setMaxUserNum(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>태그</InputLabel>
          <Select
            value={tag}
            label="태그"
            onChange={(e) => setTag(e.target.value)}
          >
            <MenuItem value="COMPETITION">COMPETITION</MenuItem>
            <MenuItem value="COMMON">COMMON</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        >
          생성하기
        </Button>
        {error && <FormHelperText error>{error}</FormHelperText>}
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>방 생성 완료</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}