import React, { useState } from 'react';
import { Checkbox, FormControlLabel, IconButton, Container, Paper, Grid, TextField, Button, Select, MenuItem, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function CreateProblemPage() {
  const navigate = useNavigate();
  const [isContest, setIsContest] = useState(false); // 대회용 문제 여부를 결정하는 상태 변수
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [category, setCategory ] = useState('');
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [memoryLimit, setMemoryLimit] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  // ... 기타 상태 변수들 선언
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');


  const handleTypeChange = (event) => {
    setIsContest(event.target.checked);
  };
  
  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };
  const removeTestCase = (index) => {
    if (testCases.length > 1) {
      const newTestCases = [...testCases];
      newTestCases.splice(index, 1);
      setTestCases(newTestCases);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const problemData = {
      title,
      description,
      difficulty,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      timeLimit,
      memoryLimit,
      category,
      tags: tag.split(',').map(t => t.trim()), // 태그를 쉼표로 분리하여 배열로 변환
      testCases,
      type: isContest ? "CONTEST" : "PRACTICE"
    };

    console.log(problemData);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 관리자 토큰 사용
        },
        body: JSON.stringify(problemData)
      });

      if (response.ok) {
        setSnackbarMessage("문제 생성 성공");
        setSnackbarSeverity("success");
        navigate('/problems');
      } else {
        throw new Error('문제 생성 중 오류 발생');
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main">
      <Paper style={{ padding: '20px' }}>
        <Typography gutterBottom align="left" variant="h6">문제 생성</Typography>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm = {6}>
              <TextField
                fullWidth
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                fullWidth
                label="태그"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="태그 입력 (예: 수학, 정렬, 배열)"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography>카테고리</Typography>
            </Grid>
            <Grid item sm={3}>
              <Select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
              >
                {['브론즈', '실버', '골드', '플래티넘', '다이아몬드'].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item sm={2}>
              <Typography>난이도</Typography>
            </Grid>
            <Grid item sm={2}>
              <Select
                fullWidth
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                displayEmpty
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={3}>
          </Grid>
            <Grid item xs={12} sm={2}>
              <Typography>시간</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="시간 제한 (초)"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="시간 제한 (예: 2.0)"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography>메모리</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="메모리 제한 (MB)"
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(e.target.value)}
                placeholder="메모리 제한 (예: 128)"
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="설명"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="문제에 대한 설명을 작성해주세요"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="입력 형식"
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                placeholder="입력 값의 형식"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="출력 형식"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="출력 값의 형식"
              />
            </Grid>
            <Grid item xs={12} sm = {6}>
              <TextField
                fullWidth
                label="예제 입력"
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                placeholder="예제 입력 (예: 1 2)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="예제 출력"
                value={sampleOutput}
                onChange={(e) => setSampleOutput(e.target.value)}
                placeholder="예제 출력 (예: 3)"
              />
            </Grid>
{testCases.map((testCase, index) => (
              <React.Fragment key={index}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label={`테스트 케이스 ${index + 1} 입력`}
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label={`테스트 케이스 ${index + 1} 출력`}
                    value={testCase.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                <IconButton onClick={() => removeTestCase(index)} disabled={testCases.length === 1}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  {index === testCases.length - 1 && (
                    <IconButton onClick={addTestCase}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isContest}
                    onChange={handleTypeChange}
                    color="primary"
                  />
                }
                label="대회 문제"
              />
              <Button variant="contained" type="submit">
                생성
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

    </Container>
  );
}
