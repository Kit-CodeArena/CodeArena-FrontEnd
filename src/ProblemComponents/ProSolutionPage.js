import React, { useState, useEffect }  from 'react';
import {  Button, Grid, Container, Typography, List, ListItem, ListItemText, Box, Paper, Divider,  Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Problems() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 20; // 페이지당 문제 수

    useEffect(() => {
      const fetchProblems = async () => {
        try {
          setIsLoading(true); // 로딩 시작
          const token = localStorage.getItem('token');
          console.log('token:', token); 
          const response = await fetch('/api/problems', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          setProblems(data.map(problem => ({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            totalSubmissions: problem.totalSubmissions,
            correctSubmissions: problem.correctSubmissions,
            accuracy: problem.accuracy
          })));
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setIsLoading(false); // 로딩 종료
        }
      };
  
      fetchProblems();
    }, []);

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
          <Container component="main" maxWidth="md" style={{ maxHeight: '80vh', paddingTop: '10px' }}>
            {isLoading && <div className="loading-bar"></div>}
            <Paper>
            <Typography variant="h6" component="h1" gutterBottom align="left"
            style={{ 
              paddingLeft: '20px', // 좌측 패딩 설정
              paddingTop: '10px', // 상단 패딩 설정
              paddingBottom: '10px' }}>
              문제 목록
            </Typography>
            <List>
  <ListItem style={{ paddingBottom: '0px' }}> {/* 하단 패딩 조정 */}
  <Grid container spacing={2} alignItems="center">
      <Grid item xs={4} style={{ padding: '10px' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>문제</Typography>
      </Grid>
      <Grid item xs={2} style={{ padding: '22px' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>난이도</Typography>
      </Grid>
      <Grid item xs={2} style={{ padding: '10px' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>카테고리</Typography>
      </Grid>
      <Grid item xs={1} style={{ padding: '10px' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>제출</Typography>
      </Grid>
      <Grid item xs={1} style={{ padding: '10px' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>정답</Typography>
      </Grid>
      <Grid item xs={2} style={{ padding: '10px' }}>
        <Typography variant="subtitle1" style={{ color: '#219afc' }}>정답률</Typography>
      </Grid>
    </Grid>
  </ListItem>
  <Divider />
                {currentProblems.map((problem,index) => (
                  <React.Fragment key={problem.id}>
                    <ListItem button onClick={() => handleProblemClick(problem.id)}>
                    <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body1">{problem.title}</Typography>
          </Grid>
          <Grid item xs={2}>
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
          <Grid item xs={2}>
            <Typography variant="body2">{problem.category}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">{problem.totalSubmissions}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">{problem.correctSubmissions}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2">{problem.accuracy}%</Typography>
          </Grid>
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
          </Container>
        </>
      );
    }