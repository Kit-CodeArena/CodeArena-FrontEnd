import React, { useEffect, useState } from 'react';
import { InputLabel, FormControl, Checkbox, FormControlLabel, IconButton, Container, Paper, Grid, TextField, Button, Select, MenuItem, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateProblemPage() {
  const navigate = useNavigate();
  const problemId = useParams().problemId; // URL에서 postId 추출
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
  const [categoryLevel, setCategoryLevel] = useState(''); // 새로운 상태 추가
  
  const [titleError, setTitleError] = useState(false);
  const [tagError, setTagError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [inputFormatError, setInputFormatError] = useState(false);
  const [outputFormatError, setOutputFormatError] = useState(false);
  const [sampleInputError, setSampleInputError] = useState(false);
  const [sampleOutputError, setSampleOutputError] = useState(false);
  const [timeLimitError, setTimeLimitError] = useState(false);
  const [memoryLimitError, setMemoryLimitError] = useState(false);
  const [difficultyError, setDifficultyError] = useState(false);
  const [testCaseErrors, setTestCaseErrors] = useState(testCases.map(() => ({ inputError: false, outputError: false })));
  const [categoryLevelError, setCategoryLevelError] = useState(false);

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

  const validateTestCases = () => {
    return testCases.map((testCase, index) => ({
      inputError: testCase.input.trim() === '',
      outputError: testCase.output.trim() === ''
    }));
  };

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/problems/${problemId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const problemData = await response.json();

        setTitle(problemData.title || '');
  
        // tags가 배열인 경우 쉼표로 구분된 문자열로 변환
        if (Array.isArray(problemData.tags)) {
          setTag(problemData.tags.join(', '));
        } else {
          setTag('');
        }
  
        setDescription(problemData.description || '');
        setInputFormat(problemData.inputFormat || '');
        setOutputFormat(problemData.outputFormat || '');
        setSampleInput(problemData.sampleInput || '');
        setSampleOutput(problemData.sampleOutput || '');
        setTimeLimit(problemData.timeLimit || '');
        setMemoryLimit(problemData.memoryLimit || '');
        setDifficulty(problemData.difficulty || '');
        setTestCases(problemData.testCases || []);
  
        // 카테고리와 카테고리 레벨 분리
        if (problemData.category) {
          const [fetchedCategory, fetchedCategoryLevel] = problemData.category.split(' ');
          setCategory(fetchedCategory);
          setCategoryLevel(fetchedCategoryLevel || '');
        } else {
          setCategory('');
          setCategoryLevel('');
        }

      } catch (error) {
        console.error('문제 데이터를 불러오는 데 실패했습니다', error);
      }
    }

    // 이 함수를 문제 ID와 함께 호출
    fetchProblemData();
  }, [problemId]);



  const handleSubmit = async () => {

    let isValid = true;

    if (title.trim() === '') {
      setTitleError(true);
      isValid = false;
    }
    if (tag.trim() === '') {
      setTagError(true);
      isValid = false;
    }
    if (!categoryLevel) {
      setCategoryLevelError(true);
      isValid = false;
    }
    if (description.trim() === '') {
      setDescriptionError(true);
      isValid = false;
    }

    if (inputFormat.trim() === '') {
      setInputFormatError(true);
      isValid = false;
    }

    if (outputFormat.trim() === '') {
      setOutputFormatError(true);
      isValid = false;
    }

    if (sampleInput.trim() === '') {
      setSampleInputError(true);
      isValid = false;
    }

    if (sampleOutput.trim() === '') {
      setSampleOutputError(true);
      isValid = false;
    }

    if (timeLimit.trim() === '') {
      setTimeLimitError(true);
      isValid = false;
    }

    if (memoryLimit.trim() === '') {
      setMemoryLimitError(true);
      isValid = false;
    }

    if (!difficulty) {
      setDifficultyError(true);
      isValid = false;
    }

    if (!category) {
      setCategoryError(true);
      isValid = false;
    }

    const newTestCaseErrors = validateTestCases();
    setTestCaseErrors(newTestCaseErrors);

    const hasTestCaseErrors = newTestCaseErrors.some(error => error.inputError || error.outputError);
    if (hasTestCaseErrors) {
      isValid = false;
    }

    if (!isValid) {
      return; // 입력이 유효하지 않으면 제출을 중단합니다.
    }

    const combinedCategory = categoryLevel ? `${category} ${categoryLevel}` : category;

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
      category: combinedCategory,
      tags: tag.split(',').map(t => t.trim()), // 태그를 쉼표로 분리하여 배열로 변환
      testCases,
      type: isContest ? "CONTEST" : "PRACTICE"
    };

    console.log(problemData);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/problems/${problemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 관리자 토큰 사용
        },
        body: JSON.stringify(problemData)
      });

      if (response.ok) {
        navigate('/problems');
      } else {
        console.log("게시물 생성 중 오류 발생");
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
    } 
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main">
      <Paper style={{ padding: '20px' }}>
        <Typography gutterBottom align="left" variant="h6">문제 수정</Typography>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm = {6}>
              <TextField
              error={titleError}
              helperText={titleError ? "제목을 입력해주세요." : ""}
                fullWidth
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
              error={tagError}
              helperText={tagError ? "태그를 입력해주세요." : ""}
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
              error={categoryError}
              helperText={categoryError ? "선택해주세요" : ""}
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
              <FormControl fullWidth>
                <InputLabel>단계</InputLabel>
                <Select
                error={categoryLevelError}
                helperText={categoryLevelError ? "선택해주세요." : ""}
                  value={categoryLevel}
                  onChange={(e) => setCategoryLevel(e.target.value)}
                  label="단계"
                >
                  {['I', 'II', 'III', 'IV', 'V'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={2}>
              <Typography>난이도</Typography>
            </Grid>
            <Grid item sm={2}>
              <Select
              error={difficultyError}
              helperText={difficultyError ? "선택해주세요." : ""}
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
            <Grid item xs={12} sm={2}>
              <Typography>시간</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
              error={timeLimitError}
              helperText={timeLimitError ? "시간을 입력해주세요." : ""}
                fullWidth
                label="시간 제한 (s)"
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
              error={memoryLimitError}
              helperText={memoryLimitError ? "메모리 제한 값을 입력해주세요." : ""}
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
              error={descriptionError}
              helperText={descriptionError ? "설명을 입력해주세요." : ""}
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
              error={inputFormatError}
              helperText={inputFormatError ? "입력 형식을 입력해주세요." : ""}
                fullWidth
                label="입력 형식"
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                placeholder="입력 값의 형식"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              error={outputFormatError}
              helperText={outputFormatError ? "출력 형식을 입력해주세요." : ""}
                fullWidth
                label="출력 형식"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="출력 값의 형식"
              />
            </Grid>
            <Grid item xs={12} sm = {6}>
              <TextField
              error={sampleInputError}
              helperText={sampleInputError ? "예제 입력을 입력해주세요." : ""}
                fullWidth
                label="예제 입력"
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                placeholder="예제 입력 (예: 1 2)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
              error={sampleOutputError}
              helperText={sampleOutputError ? "예제 출력을 입력해주세요." : ""}
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
                  error={testCaseErrors[index].inputError}
                  helperText={testCaseErrors[index].inputError ? "입력을 작성해주세요." : ""}
                    fullWidth
                    label={`테스트 케이스 ${index + 1} 입력`}
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                              error={testCaseErrors[index].outputError}
                              helperText={testCaseErrors[index].outputError ? "출력을 작성해주세요." : ""}
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
              <Button variant="contained" onClick={handleSubmit}>
                생성
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

    </Container>
  );
}
