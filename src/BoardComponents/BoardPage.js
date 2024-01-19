import React, { useState, useEffect }  from 'react';
import { Dialog, DialogTitle, DialogActions, Menu, IconButton, Fab, Button, FormControl, Alert, MenuItem, TextField, Select, useMediaQuery, List, ListItem, Grid, Divider, Container, Typography, Box, Paper, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // "+" 아이콘
import EditIcon from '@mui/icons-material/Edit'; // 설정 아이콘 임포트
import MoreVertIcon from '@mui/icons-material/MoreVert'; // 메뉴 아이콘
import '../App.css';

export default function BoardPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 게시글 데이터를 저장할 상태
  const [isLoading, setIsLoading] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20; // 페이지당 게시글 수
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState(false); // 검색 에러 상태
  const [filter, setFilter] = useState('all'); // 검색 필터
  const userNickname = localStorage.getItem('nickname');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleDeleteClick = (postId) => {
    setSelectedPostId(postId);
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleCreatePost = () => {
    // 게시글 생성 페이지로 이동하는 로직
    navigate('/create-post'); // 예시 URL, 실제 경로에 맞게 수정하세요.
  };

 const handleClick = (event) => {
  event.stopPropagation(); // 이벤트 전파 중단
  setAnchorEl(event.currentTarget);
};

const handleEditClick = (postId) => {
  handleClose();
  navigate(`/update-post/${postId}`);
};

const handleClose = (event) => {
  if (event) {
    event.stopPropagation();
  }
  setAnchorEl(null);
};

  const handleSearch = async () => {
    if (!searchTerm) {
      setSearchError(true);
      return;
    }
    setSearchError(false);

    let endpoint = '/api/posts/search/';
    if (filter === 'title') {
      endpoint += `title?title=${encodeURIComponent(searchTerm)}`;
    } else if (filter === 'content') {
      endpoint += `tag?tag=${encodeURIComponent(searchTerm)}`;
    } else {
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
      setPosts(data); // 검색된 데이터로 게시글 상태 업데이트
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
    let interval = seconds / 31536000; // 연 단위
  
    if (interval > 1) {
      return Math.floor(interval) + "년 전";
    }
    interval = seconds / 2592000; // 월 단위
    if (interval > 1) {
      return Math.floor(interval) + "달 전";
    }
    interval = seconds / 86400; // 일 단위
    if (interval > 1) {
      return Math.floor(interval) + "일 전";
    }
    interval = seconds / 3600; // 시간 단위
    if (interval > 1) {
      return Math.floor(interval) + "시간 전";
    }
    interval = seconds / 60; // 분 단위
    if (interval > 1) {
      return Math.floor(interval) + "분 전";
    }
    return Math.floor(seconds) + "초 전";
  }

  useEffect(() => {
    // 게시판 데이터를 가져오는 로직
    const fetchPosts = async () => {
      try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      console.log('token:', token); 
      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let data = await response.json();
      data = data.slice().reverse(); // 데이터 복사 후 역순으로 정렬
      setPosts(data);
    }catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchPosts();
  }, []);

  const handleDeleteConfirm = async () => {
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${selectedPostId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Something went wrong with the delete request');
      }
  
      console.log("Post deleted successfully:", selectedPostId);
      setPosts(posts.filter(post => post.id !== selectedPostId));
      setOpenDialog(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleChangePage = (event, page) => {
    setCurrentPage(page);
  };

  const handlePostClick = (postId) => {
    console.log('Clicked post ID:', postId); // 클릭된 문제 ID 확인
      navigate(`/board/${postId}`); // 문제의 세부 사항 페이지로 이동
    };


  return (
    <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', height: '75vh', padding: '10px' }}>
      {isLoading && <div className="loading-bar"></div>}
      <Paper>
        <Typography variant="h6" component="h1" gutterBottom align="left" 
        style={{ 
          paddingLeft: '20px',
          paddingTop: '10px', 
          paddingBottom: '10px' }}>
          게시판
        </Typography>
        <List>
        <ListItem style={{ paddingBottom: '0px' }}> {/* 하단 패딩 조정 */}
  <Grid container spacing={1} alignItems="center">
      <Grid item xs={3}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>제목</Typography>
      </Grid>
      <Grid item xs={2} style={{textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>태그</Typography>
      </Grid>
      <Grid item xs={2} style={{textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>작성자</Typography>
      </Grid>
      <Grid item xs={1} style={{textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>조회수</Typography>
      </Grid>
      <Grid item xs={1} style={{textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>좋아요</Typography>
      </Grid>
      <Grid item xs={1} style={{textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>댓글</Typography>
      </Grid>
      <Grid item xs={2} style={{textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>작성일</Typography>
      </Grid>
    </Grid>
  </ListItem>
  <Divider />
                {currentPosts.map((post,index) => (
                  <React.Fragment key={post.id}>
                    <ListItem button onClick={() => handlePostClick(post.id)}>
                    <Grid container spacing={1} alignItems="center">
          <Grid item xs={3}>
            <Typography variant="body1">{post.title}</Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }}>
          <Typography variant="body1">{post.tags}</Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{post.authorNickname}</Typography>
          </Grid>
          <Grid item xs={1} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{post.views}</Typography>
          </Grid>
          <Grid item xs={1} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{post.likes}</Typography>
          </Grid>
          <Grid item xs={1} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{post.commentCount}</Typography>
          </Grid>
          {post.authorNickname === userNickname ? (
          // 사용자 닉네임이 게시물 작성자와 일치하는 경우 (본인 게시물)
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Typography variant="body2" component="span" style={{ marginLeft: '20px' }}>
              {timeSince(post.createdAt)}
            </Typography>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="post-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
<MenuItem onClick={(e) => {
  e.stopPropagation(); // 부모 요소의 이벤트 전파 중단
  handleEditClick(post.id);
}}>
  수정
</MenuItem>

<MenuItem onClick={(e) => {
  e.stopPropagation(); // 부모 요소의 이벤트 전파 중단
  handleClose();
  handleDeleteClick(post.id);
}}>
  삭제
</MenuItem>
      </Menu>
    </Grid>
        ) : (
          // 사용자 닉네임이 게시물 작성자와 일치하지 않는 경우 (다른 사용자의 게시물)
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Typography variant="body2" component="span">
              {timeSince(post.createdAt)}
            </Typography>
          </Grid>
        )}
      </Grid>
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
      <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={handleCreatePost}>
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
            <MenuItem value="title">제목</MenuItem>
            <MenuItem value="content">태그</MenuItem>
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
      <Dialog
  open={openDialog}
  onClose={handleDialogClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">
    {"정말 삭제하시겠습니까?"}
  </DialogTitle>
  <DialogActions>
  <Button onClick={handleDeleteConfirm} autoFocus>
      삭제
    </Button>
    <Button onClick={handleDialogClose}>취소</Button>
  </DialogActions>
</Dialog>
    </Container>
  );
}