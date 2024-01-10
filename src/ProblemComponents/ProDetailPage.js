import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';
import Header from '../MainComponents/Header';

export default function ProblemDetail() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleTitleClick = () => {
    navigate(`/problems/${problemId}`);
  };

  useEffect(() => {
    const fetchProblemDetail = async () => {
      const token = localStorage.getItem('token');
      try {
        setIsLoading(true); // 로딩 시작
        const response = await fetch(`/api/problems/${problemId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Problem fetch failed');
        }

        const data = await response.json();
        setProblem(data);
      } catch (error) {
        console.error('Fetch error:', error);
        navigate('/problems'); // 에러 발생시 문제 목록 페이지로 리다이렉트
      }finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchProblemDetail();
  }, [problemId, navigate]);

  if (isLoading) {
    // 로딩 중 로딩 바 표시
    return (
      <>
        <Header title="Code Arena" />
        <div className="loading-bar"></div> {/* 로딩 바 추가 */}
      </>
    );
  }

  if (!problem) {
    return <div>Loading...</div>; // 데이터 로딩 중 표시
  }

  return (
    <>
      <Header title="Code Arena" />
        <Container component="main" maxWidth="md" style={{ maxHeight: '80vh' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          
          onClick={() => navigate(`/problems/${problemId}`)}
          style={{ cursor: 'pointer', fontWeight: 700}}  // 마우스 오버 시 커서 변경
        >
          {problem.title}
        </Typography>
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Grid container spacing={2 }>
          <Grid item xs={4}>
            <Typography variant="h9"  style={{ fontWeight: 600 }}>난이도</Typography>
            <Box mt={1}></Box> <Divider /> 
            <Typography variant="subtitle1" >{problem.difficulty}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h9"  style={{ fontWeight: 600 }}>제한 시간</Typography>
            <Box mt={1}></Box> <Divider />
            <Typography variant="subtitle1">{problem.timeLimit}초</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h9"  style={{ fontWeight: 600 }}>메모리 제한</Typography>
            <Box mt={1}></Box> <Divider />
            <Typography variant="subtitle1">{problem.memoryLimit}MB</Typography>
          </Grid>
        </Grid>
        </Paper>
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>문제</Typography>
          <Box mt={1}></Box>
          <Divider />
          <Box mt={1}></Box>
          <Typography variant="body1">{problem.description}</Typography>
          <Box mt={2}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>입력</Typography>
          <Box mt={1}></Box>
          <Divider />
          <Box mt={1}></Box>
          <Typography variant="body1">{problem.inputFormat}</Typography>
          </Box>
          <Box mt={2}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>출력</Typography>
          <Box mt={1}></Box>
          <Divider />
          <Box mt={1}></Box>
          <Typography variant="body1">{problem.outputFormat}</Typography>
          </Box>
          <Box mt={2}>
  <Grid container spacing={2}>
    <Grid item xs={6}> {/* 6/12 공간 차지 */}
      <Typography variant="h5" style={{ fontWeight: 600 }}>예제 입력</Typography>
      <Box mt={1}></Box>
      <Divider />
      <Box mt={1}></Box>
      <Typography variant="body1">{problem.sampleInput}</Typography>
    </Grid>
    <Grid item xs={6}> {/* 나머지 6/12 공간 차지 */}
      <Typography variant="h5" style={{ fontWeight: 600 }}>예제 출력</Typography>
      <Box mt={1}></Box>
      <Divider />
      <Box mt={1}></Box>
      <Typography variant="body1">{problem.sampleOutput}</Typography>
    </Grid>
  </Grid>
</Box>
        </Paper>
      </Container>
    </>
  );
}