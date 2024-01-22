import React, { useState, useEffect }  from 'react';
import { FormControl, Select, TextField, Alert, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ButtonGroup, Fab, useMediaQuery, Button, Grid, Container, Typography, List, ListItem, ListItemText, Box, Paper, Divider,  Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // "+" 아이콘
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../App.css';

export default function Problems() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 20; // 페이지당 문제 수
    const isLargeScreen = useMediaQuery('(min-width:1100px)');
    const [selectedMenu, setSelectedMenu] = useState('all'); // 현재 선택된 메뉴 상태
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // 메뉴 위치 상태
    const open = Boolean(anchorEl); // 메뉴 열림 상태
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingProblemId, setDeletingProblemId] = useState(null);
    const role = localStorage.getItem('role'); // 'role' 값을 가져옴
    const [filter, setFilter] = useState('title');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState(false);
    const [isSearchResultEmpty, setIsSearchResultEmpty] = useState(false);

    const handleFilterChange = (event) => {
      setFilter(event.target.value);
    };
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSearch = async () => {
      if (!searchTerm) {
        setSearchError(true);
        return;
      }
      setSearchError(false);
  
      let endpoint = '/api/problems/';
      if (filter === 'title') {
        endpoint += `title?title=${encodeURIComponent(searchTerm)}`;
      } else if (filter === 'difficulty') {
        endpoint += `difficulty?difficulty=${encodeURIComponent(searchTerm)}`;
      } else if (filter === 'category') {
        endpoint += `category?category=${encodeURIComponent(searchTerm)}`;
      }
      else if (filter === 'tag') {
        endpoint += `tag?tag=${encodeURIComponent(searchTerm)}`;
      }
      else {
        // 다른 검색 필터 처리
      }
  
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        if (data.length === 0) {
          setIsSearchResultEmpty(true); // 검색 결과가 없음
        } else {
          setIsSearchResultEmpty(false); // 검색 결과가 있음
          setProblems(data); // 검색된 데이터로 게시글 상태 업데이트
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };
  

    const handleClick = (event) => {
      event.stopPropagation(); // 이벤트 전파 중단
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = (event) => {
      if (event) {
        event.stopPropagation();
      }
      setAnchorEl(null);
    };


    const handleMenuClick = (menu) => {
      setSelectedMenu(menu); // 선택된 메뉴 업데이트
      setCurrentPage(1); // 페이지를 다시 첫 페이지로 설정
    };

    const handleCreateProblem = () => {
      if (role === 'ADMIN') {
        navigate('/create-problem');
      } else {
        setOpenDialog(true);
      }
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  
    const handleDeleteClick = (problemId) => {
      setDeletingProblemId(problemId);
      setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`/api/problems/${deletingProblemId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Delete failed');
  
        setProblems(prevProblems => prevProblems.filter(problem => problem.id !== deletingProblemId));
        setDeleteDialogOpen(false); // 삭제 확인 다이얼로그 닫기
      } catch (error) {
        console.error('Delete error:', error);
        // 오류 처리 로직
      } finally {
        setDeleteDialogOpen(false);
      }
    };

    const handleCloseDeleteDialog = () => {
      setDeleteDialogOpen(false);
    };
    
    useEffect(() => {
      const fetchProblems = async () => {
        let endpoint = '/api/problems';
        if (selectedMenu === 'contest') endpoint += '/contest';
        else if (selectedMenu === 'practice') endpoint += '/practice';
  
        try {
          setIsLoading(true); // 로딩 시작
          const token = localStorage.getItem('token');
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setProblems(data); // 데이터 설정
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setIsLoading(false); // 로딩 종료
        }
      };
      fetchProblems();
    },[selectedMenu]); // menu가 변경될 때마다 요청

    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);
  
    const totalPages = Math.ceil(problems.length / problemsPerPage);
  
    const handleChangePage = (event, page) => {
      setCurrentPage(page);
    };

    const handleProblemClick = (problemId) => {
      console.log('Clicked problem ID:', problemId); // 클릭된 문제 ID 확인
        navigate(`/problems/${problemId}`); // 문제의 세부 사항 페이지로 이동
      };
  
      return (
        <>
          <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', height: '75vh', padding: '10px' }}>
            {isLoading && <div className="loading-bar"></div>}
            <Paper>
            <Typography variant="h6" component="h1" gutterBottom align="left"
            style={{ 
              paddingLeft: '20px', // 좌측 패딩 설정
              paddingTop: '10px', // 상단 패딩 설정
              paddingBottom: '10px' }}>
              문제 목록
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 2, pl: 2 }}>
            <ButtonGroup variant="text" aria-label="text button group">
  <Button
    onClick={() => handleMenuClick('all')}
    style={{
      backgroundColor: selectedMenu === 'all' ? 'black' : '',
      color: selectedMenu === 'all' ? 'white' : '',
      borderRadius: 0,
    }}
  >
    전체 문제
  </Button>
  <Button
    onClick={() => handleMenuClick('contest')}
    style={{
      backgroundColor: selectedMenu === 'contest' ? 'black' : '',
      color: selectedMenu === 'contest' ? 'white' : '',
      borderRadius: 0,
    }}
  >
    대회 문제
  </Button>
  <Button
    onClick={() => handleMenuClick('practice')}
    style={{
      backgroundColor: selectedMenu === 'practice' ? 'black' : '',
      color: selectedMenu === 'practice' ? 'white' : '',
      borderRadius: 0,
    }}
  >
    연습 문제
  </Button>
</ButtonGroup>
</Box>
            <List>
  <ListItem style={{ paddingBottom: '0px' }}> {/* 하단 패딩 조정 */}
  <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>문제</Typography>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>난이도</Typography>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>카테고리</Typography>
      </Grid>
      <Grid item xs={1} style={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>제출</Typography>
      </Grid>
      <Grid item xs={1} style={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>정답</Typography>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center', display: 'flex', alignItems: 'left', justifyContent: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>정답률</Typography>
      </Grid>
    </Grid>
  </ListItem>
  <Divider />
                {currentProblems.map((problem,index) => (
                  <React.Fragment key={problem.id}>
                    <ListItem button onClick={() => handleProblemClick(problem.id)}>
                    <Grid container spacing={1} alignItems="center">
          <Grid item xs={4}>
            <Typography variant="body1">{problem.title}</Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }}>
  {problem.difficulty == 1 && (
    <Button variant="contained" style={{ fontSize: '10px', backgroundColor: '#3de388', color: '#0a0a0a' }}>
      하
    </Button>
  )}
  {problem.difficulty == 2 && (
    <Button variant="contained" style={{ fontSize: '10px', backgroundColor: '#219afc', color: '#0a0a0a' }}>
      중
    </Button>
  )}
  {problem.difficulty == 3 && (
    <Button variant="contained" style={{ fontSize: '10px', backgroundColor: '#ff0303', color: '#fafafa' }}>
      상
    </Button>
  )}
</Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{problem.category}</Typography>
          </Grid>
          <Grid item xs={1} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{problem.totalSubmissions}</Typography>
          </Grid>
          <Grid item xs={1} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{problem.correctSubmissions}</Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
    <Typography variant="body2" style={{ flex: 1, marginLeft: '40px' }}>{problem.accuracy}%</Typography>
          {role === 'ADMIN' && (
            <>
              <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id={`problem-menu-${problem.id}`}
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => {/* 수정 로직 */}}>수정</MenuItem>
                <MenuItem onClick={(e) => {
  e.stopPropagation(); // 부모 요소의 이벤트 전파 중단
  handleClose();
  handleDeleteClick(problem.id);
}}>삭제</MenuItem>
              </Menu>
            </>
          )}
        </Grid>
        {/* 기존 Grid 항목들의 나머지 부분... */}
      </Grid>
    </ListItem>
    {index !== currentProblems.length - 1 && <Divider />}
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
            <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={handleCreateProblem}>
        <AddIcon />
      </Fab>
      <Box display="flex" justifyContent="center" mt={2} alignItems="center">
        <FormControl style={{ minWidth: 60, marginRight: '10px' }}>
          <Select
            value={filter}
            onChange={handleFilterChange}
            sx={{
              height:40,
              background: 'white',
              '& .MuiSelect-select': {
                backgroundcolor: 'white',
              },
            }}
          >
            <MenuItem value="title">문제</MenuItem>
            <MenuItem value="difficulty">난이도</MenuItem>
            <MenuItem value="category">카테고리</MenuItem>
            <MenuItem value="tags">태그</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            height:40,
            background: 'white',
            '& .MuiSelect-select': {
              backgroundcolor: 'white',
            },
            '.MuiInputBase-input': {
              padding: '9px 0px', // 입력 필드 패딩
              fontSize: '1.0rem', // 입력 필드 폰트 크기
            },
          }}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          검색
        </Button>
      </Box>
      {searchError && (
        <Alert severity="error" style={{ marginBottom: '10px' }}>
          내용을 입력해주세요.
        </Alert>
      )}
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

      <Dialog
      open={deleteDialogOpen}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">게시물 삭제</DialogTitle>
      <DialogContent>
        <DialogContentText>정말 게시물을 삭제하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleDeleteConfirm} color="primary">
          확인
        </Button>
        <Button onClick={handleCloseDeleteDialog} color="primary">
          취소
        </Button>
      </DialogActions>
    </Dialog>
          </Container>
        </>
      );
    }