import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { StyledLink  } from '../theme.js';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <StyledLink color="inherit" href="https://mui.com/">
        Your Website
      </StyledLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {

    event.preventDefault();

    let hasError = false;

    if (!email) {
      setEmailError('이메일을 입력해주세요');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해주세요');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!hasError) {
      console.log({ email, password });
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  }

    // 로그인 요청 로직
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Token:', result.token);
        setSnackbarMessage('로그인 성공');
        // 로그인 성공 후 토큰 저장 및 페이지 이동 로직 (예: navigate('/dashboard'))
        localStorage.setItem('token', result.token);
        navigate('/');
      } else {
        const errorResult = await response.json();
        setSnackbarMessage(`로그인 실패: ${errorResult.message}`);
      }
    } catch (error) {
      setSnackbarMessage('네트워크 오류');
    }

    setSnackbarOpen(true);
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 비밀번호 필드 초기화
    setPassword('');
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (event.target.value) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value) {
      setPasswordError('');
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 3, bgcolor: 'secondary.main' }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Code Arena
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="off"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
            />
    <FormControlLabel
      control={<Checkbox value="remember" color="primary" />}
      label={
        <Typography sx={{ fontSize: '12px', fontFamily: 'Arial' }}>
          로그인 상태 유지
        </Typography>
      }
    />
            <Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{
    mt: 3,
    mb: 5,
    fontSize: '1.25rem', // 폰트 사이즈를 키웁니다.
    padding: '10px 20px', // 버튼의 내부 패딩을 조절합니다.
    height: '50px', // 버튼의 높이를 지정합니다 (필요한 경우).
    minWidth: '150px', // 버튼의 최소 너비를 지정합니다 (필요한 경우).
    fontFamily: 'Kalnia'
  }}
            >
            로그인
            </Button>
            <Grid container>
              <Grid item xs>
                <StyledLink to="/signup">
                  회원가입
                </StyledLink>
              </Grid>
              <Grid item>
                <StyledLink href="#" variant="body2">
                  비밀번호 찾기
                </StyledLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 10, mb: 4 }} />
        <Snackbar
    open={snackbarOpen}
    autoHideDuration={6000}
    onClose={() => setSnackbarOpen(false)}
  >
    <MuiAlert
      onClose={() => setSnackbarOpen(false)}
      severity="success"
      elevation={6}
      variant="filled"
    >
      {snackbarMessage}
    </MuiAlert>
  </Snackbar>

      </Container>
  );
}