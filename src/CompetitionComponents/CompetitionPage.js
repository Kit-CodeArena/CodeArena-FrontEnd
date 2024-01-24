import React, { useState, useEffect }  from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fab, useMediaQuery, Button, Grid, Container, Typography, List, ListItem, ListItemText, Box, Paper, Divider,  Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // "+" 아이콘
import '../App.css';

export default function CompetitionPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]); // 채팅방 목록 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20; // 페이지당 대회 수
  const [openDialog, setOpenDialog] = useState(false); // 추가된 상태
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const userRole = localStorage.getItem('role');
  const [isLoading, setIsLoading] = useState(false);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = rooms.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(rooms.length / postsPerPage);

  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };
  
  const handleRoomClick = (roomId) => {
    navigate(`/competition/${roomId}`);
};

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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/test/rooms`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('네트워크 오류');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // 날짜에 따라 정렬
          const sortedData = data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
          setRooms(sortedData);
        } else {
          console.error('응답 데이터가 올바르지 않습니다:', data);
        }
      } catch (error) {
        console.error('채팅방 목록을 불러오는 데 실패했습니다', error);
      }
      finally{
        setIsLoading(false); // 로딩 종료
      }
    };
    fetchRooms();
  }, []);

    return (
      <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minheight: '75vh', padding: '10px' }}>
        {isLoading && <div className="loading-bar"></div>}
        <Paper>
          <Typography variant="h6" component="h1" gutterBottom align="left" style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
            대회
          </Typography>
        </Paper>
        <Paper>
        <List>
  {rooms.map((room, index) => (
     <React.Fragment key={room.id}>
    <ListItem 
     button onClick={() => handleRoomClick(room.id)}
    >
      <ListItemText
        primary={room.name}
        secondary={`참가자: ${room.curUserNum}/${room.maxUserNum} - 상태: ${room.status}`}
      />
    </ListItem>
    {index !== currentPosts.length - 1 && <Divider />}
     </React.Fragment>
  ))}
</List>
      </Paper>
            <Box display="flex" justifyContent="center" mt={2}>
        <Pagination 
         count={totalPages}
         page={currentPage} 
         onChange={handleChangePage} 
         color="primary" 
         />
      </Box>
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