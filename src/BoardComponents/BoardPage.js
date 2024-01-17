import React, { useState, useEffect }  from 'react';
import { Button, FormControl, Alert, MenuItem, TextField, Select, useMediaQuery, List, ListItem, Grid, Divider, Container, Typography, Box, Paper, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
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

      const data = await response.json();
      setPosts(data);
    }catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchPosts();
  }, []);

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
      <Grid item xs={4}>
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
          <Grid item xs={4}>
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
          <Grid item xs={2} style={{ textAlign: 'center' }}>
            <Typography variant="body2">{timeSince(post.createdAt)}</Typography>
          </Grid>
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
    </Container>
  );
}