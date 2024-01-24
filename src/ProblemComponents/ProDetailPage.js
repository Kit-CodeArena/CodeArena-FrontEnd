import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem, TextField, useMediaQuery, Button, Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';

function ProblemSolvingSection() {
  const { problemId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [solutionCode, setSolutionCode] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleLanguageChange = (event) => {
      setSelectedLanguage(event.target.value);
  };

  const handleCodeChange = (event) => {
      const code = event.target.value;
      setSolutionCode(code);
      setCharCount(code.length); // 글자 수 계산 및 상태 업데이트
  };

  const handleSubmit = async () => {
      // 여기에 제출 로직 구현
      const token = localStorage.getItem('token');

      try {
          const response = await fetch('/api/submissions', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  problemId,
                  code: solutionCode,
                  language: selectedLanguage
              })
          });

          const responseData = await response.json();

          if (response.ok) {
            if (responseData.status === "ACCEPTED") {
                alert('정답입니다!');
            } else if (responseData.status === "REJECTED") {
                alert('오답입니다.');
            }
            // 여기에 추가적인 성공 처리 로직을 추가할 수 있습니다.
        }  else {
          // 오류 메시지 표시
          alert('제출 실패: ' + responseData.message);
          // 여기에 추가적인 실패 처리 로직을 추가할 수 있습니다.
        }
      } catch (error) {
          console.error('제출 중 오류:', error);
          alert('제출 중 오류가 발생했습니다.');
      }
  };

  return (
      <div>
          <FormControl fullWidth margin="normal">
              <InputLabel id="language-select-label">언어 선택</InputLabel>
              <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={selectedLanguage}
                  label="언어 선택"
                  onChange={handleLanguageChange}
              >
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
              </Select>
          </FormControl>

          <TextField
              id="code-editor"
              label="코드 작성"
              multiline
              rows={10}
              value={solutionCode}
              onChange={handleCodeChange}
              variant="outlined"
              fullWidth
              margin="normal"
          />
          <Typography variant="caption" display="block" gutterBottom>
              문자 Count: {charCount}
          </Typography>
          <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              style={{ marginTop: '10px' }}
          >
              제출
          </Button>
      </div>
  );
}

export default function ProblemDetail() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
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
        <div className="loading-bar"></div> {/* 로딩 바 추가 */}
      </>
    );
  }

  if (!problem) {
    return <div>Loading...</div>; // 데이터 로딩 중 표시
  }

  return (
    <>
        <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minheight: '75vh', padding: '10px' }}>
        <Paper>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom align="left"
          
          onClick={() => navigate(`/problems/${problemId}`)}
          style={{ cursor: 'pointer', fontWeight: 700,               
          paddingLeft: '20px', // 좌측 패딩 설정
          paddingTop: '10px', // 상단 패딩 설정
          paddingBottom: '10px', // 하단 패딩 설정
        }}  
        >
          {problem.title}
        </Typography>
        <Grid container spacing={2 }>
          <Grid item xs={4}>
            <Typography variant="h9" style={{ fontWeight: 100}}>난이도</Typography>
            <Box mt={1}></Box> <Divider /> 
            {problem.difficulty == 1 && (
    <Typography variant="subtitle1" style={{ color: '#3de388' }}>
      하
    </Typography>
  )}
  {problem.difficulty == 2 && (
    <Typography variant="subtitle1" style={{ color: '#219afc' }}>
      중
    </Typography>
  )}
  {problem.difficulty == 3 && (
    <Typography variant="subtitle1" style={{ color: '#ff0303' }}>
      상
    </Typography>
  )}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h9"  style={{ fontWeight: 100 }}>시간 제한</Typography>
            <Box mt={1}></Box> <Divider />
            <Typography variant="subtitle1">{problem.timeLimit}초</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h9"  style={{ fontWeight: 100 }}>메모리 제한</Typography>
            <Box mt={1}></Box> <Divider />
            <Typography variant="subtitle1">{problem.memoryLimit}MB</Typography>
          </Grid>
        </Grid>
        </Paper>
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom align="left" style={{ fontWeight: 100, color: '#219afc' }}>문제</Typography>
          <Box mt={1}></Box>
          <Divider />
          <Box mt={1}></Box>
          <Typography variant="body1" gutterBottom align="left" >{problem.description}</Typography>
          <Box mt={2}>
          <Typography variant="h6" gutterBottom align="left" style={{ fontWeight: 100, color: '#219afc' }}>입력</Typography>
          <Box mt={1}></Box>
          <Divider />
          <Box mt={1}></Box>
          <Typography variant="body1" gutterBottom align="left" >{problem.inputFormat}</Typography>
          </Box>
          <Box mt={2}>
          <Typography variant="h6" gutterBottom align="left" style={{ fontWeight: 100, color: '#219afc' }}>출력</Typography>
          <Box mt={1}></Box>
          <Divider />
          <Box mt={1}></Box>
          <Typography variant="body1" gutterBottom align="left" >{problem.outputFormat}</Typography>
          </Box>
          <Box mt={2}>
  <Grid container spacing={2}>
    <Grid item xs={6}> {/* 6/12 공간 차지 */}
      <Typography variant="h6" style={{ fontWeight: 100, color: '#219afc' }}>예제 입력</Typography>
      <Box mt={1}></Box>
      <Divider />
      <Box mt={1}></Box>
      <Paper elevation={1} style={{
      fontFamily: '"Courier New", Courier, monospace', // 모노스페이스 글꼴
      backgroundColor: '#f5f5f5', // 메모장 같은 배경색
      padding: '10px', // 내부 패딩
      borderRadius: '1px', // 약간 둥근 모서리
      whiteSpace: 'pre-wrap', // 공백과 줄바꿈 유지
      wordBreak: 'break-all' // 긴 텍스트를 적절히 줄바꿈
    }}>
      <Typography variant="body1">{problem.sampleInput}</Typography>
      </Paper>
    </Grid>
    <Grid item xs={6}> {/* 나머지 6/12 공간 차지 */}
      <Typography variant="h6" style={{ fontWeight: 100, color: '#219afc' }}>예제 출력</Typography>
      <Box mt={1}></Box>
      <Divider />
      <Box mt={1}></Box>
      <Paper elevation={1} style={{
      fontFamily: '"Courier New", Courier, monospace', // 모노스페이스 글꼴
      backgroundColor: '#f5f5f5', // 메모장 같은 배경색
      padding: '10px', // 내부 패딩
      borderRadius: '1px', // 약간 둥근 모서리
      whiteSpace: 'pre-wrap', // 공백과 줄바꿈 유지
      wordBreak: 'break-all' // 긴 텍스트를 적절히 줄바꿈
    }}>
      <Typography variant="body1">{problem.sampleOutput}</Typography>
      </Paper>
    </Grid>
  </Grid>
</Box>
        </Paper>
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
                    <Typography variant="h6" gutterBottom align="left" style={{ fontWeight: 100, color: '#219afc', paddingBottom: '10px' }}>문제 풀이</Typography>
                    <ProblemSolvingSection />
                </Paper>
      </Container>

        </>
  );
}