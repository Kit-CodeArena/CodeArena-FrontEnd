import React, { useState, useEffect }  from 'react';
import { Container, Typography, Box, Paper, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function BoardPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 게시글 데이터를 저장할 상태
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20; // 페이지당 게시글 수

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
      setPosts(data.map(post => ({
        id: post.id,
        title: post.title,
      }))); 
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

  return (
    <Container component="main" maxWidth="md" style={{ maxHeight: '80vh', paddingTop: '10px' }}>
      {isLoading && <div className="loading-bar"></div>}
      <Paper>
        <Typography variant="h6" component="h1" gutterBottom align="left" style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
          게시판
        </Typography>
        {/* 여기에 게시판 내용 (예: 게시글 목록)을 렌더링 */}
      </Paper>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination 
         count={totalPages}
         page={currentPage} 
         onChange={handleChangePage} 
         color="primary" 
         />
      </Box>
    </Container>
  );
}