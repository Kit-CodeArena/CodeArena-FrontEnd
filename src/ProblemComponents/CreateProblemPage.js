import React, { useState } from 'react';
import { IconButton, Container, Paper, Grid, TextField, Button, Select, MenuItem, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function CreateProblemPage() {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
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
    // 폼 제출 로직 구현
    // 예: 서버에 POST 요청 보내기
  };

  return (
    <Container component="main">
      <Paper style={{ padding: '20px' }}>
        <Typography gutterBottom align="left" variant="h6">문제 생성</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm = {6}>
              <TextField
                fullWidth
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="태그"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="태그 입력 (예: 수학, 정렬, 배열)"
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
            <Grid item xs={12}>
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
