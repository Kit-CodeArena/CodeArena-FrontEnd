import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useMediaQuery, Button, Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';


export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1100px)');

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

  const handleTitleClick = () => {
    navigate(`/board/${postId}`);
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      const token = localStorage.getItem('token');
      try {
        setIsLoading(true); // 로딩 시작
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Post fetch failed');
        }

        const data = await response.json();
        setPost(data);
      }catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setIsLoading(false); // 로딩 종료
        }
      };

    fetchPostDetail();
  }, [postId, navigate]);

  if (isLoading) {
    // 로딩 중 로딩 바 표시
    return (
      <>
        <div className="loading-bar"></div> {/* 로딩 바 추가 */}
      </>
    );
  }

  if (!post) {
    return <div>Loading...</div>; // 데이터 로딩 중 표시
  }

  return (
    <>
        <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%' , height: '75vh', padding: '10px' }}>
        <Paper>
        <Typography 
      variant="h5" 
      component="h1" 
      gutterBottom align="left"
      onClick={() => navigate(`/board/${postId}`)}
      style={{ cursor: 'pointer', fontWeight: 200, paddingLeft: '20px', paddingTop: '10px'}}
    >
      {post.title}
    </Typography>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography style={{ paddingLeft: '20px', color: 'gray', fontSize: '14px' }}>
      {post.authorNickname}
    </Typography>
    <Typography style={{ margin: '0 10px', fontSize: '14px' }}>
      |
    </Typography>
    <Typography style={{ color: 'gray', fontSize: '14px' }}>
      {timeSince(post.createdAt)}
    </Typography>
  </div>

  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography 
      variant="h6" 
      component="h2" 
      style={{ fontWeight: 200, fontSize: '13px', marginRight: '20px', color: 'gray'}}
    >
      조회수  {post.views}
    </Typography>
    <Typography 
      variant="h6" 
      component="h2" 
      style={{ fontWeight: 200, fontSize: '13px', marginRight: '20px', color: 'gray' }}
    >
      좋아요 {post.likes}
    </Typography>
  </div>
</div>

  </Paper>
  <Paper style={{ marginTop: '15px' }}>
  <div style={{ 
    border: '2px solid #e0e0e0', // 테두리
    padding: '15px', // 내부 패딩
    paddingBottom: '10px'
  }}>
    <Typography 
      variant="h6" 
      component="h2" 
      gutterBottom align="left"
      style={{ 
        fontWeight: 200 , fontSize: '15px' 
      }}
    >
      {post.content}
    </Typography>
    </div>
        </Paper>
      </Container>
    </>
  );
}
