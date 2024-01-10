import React, { useState, useEffect }  from 'react';
import {  Container, Typography, List, ListItem, ListItemText, Box, Paper, Divider,  Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../MainComponents/Header';
import '../App.css';

export default function Problems() {
    // 예시 문제 데이터를 생성합니다
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
            title: problem.title
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
          <Header title="Code Arena" />
          <Container component="main" maxWidth="md" style={{ maxHeight: '80vh' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              문제 목록
            </Typography>
            {isLoading && <div className="loading-bar"></div>}
            <Paper>
              <List>
                {currentProblems.map((problem,index) => (
                  <React.Fragment key={problem.id}>
                    <ListItem button onClick={() => handleProblemClick(problem.id)}>
                      <Box display="flex" justifyContent="space-between" width="100%">
                          <Typography variant="h6">{problem.title}</Typography>
                        </Box>
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