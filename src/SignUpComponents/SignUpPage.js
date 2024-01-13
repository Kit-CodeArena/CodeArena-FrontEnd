import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate를 react-router-dom에서 임포트
import { useState } from 'react'; // useState를 React에서 임포트
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { StyledLink  } from '../theme.js';

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignUp() {
const navigate = useNavigate(); // useNavigate 훅 사용
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userData = {
      username: data.get('name'),
      nickname: data.get('nickName'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setSnackbarOpen(true);
        navigate('/signin');
      } else {
        setSnackbarMessage(`회원가입 실패: ${response.status}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('네트워크 오류');
      setSnackbarOpen(true);
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="이름"
                  name="name"
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="이메일"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confrimPassword"
                  label="비밀번호 확인"
                  type="password"
                  id="confirm-password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nickName"
                  label="닉네임"
                  name="nickName"
                  autoComplete="nickName"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="개인정보 수집에 동의 합니다(선택)"
                />
              </Grid>
            </Grid>
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
              회원가입
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              <StyledLink to="/signin">
                  로그인
                </StyledLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
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