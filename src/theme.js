import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#d902fa",
    },
  },
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif"
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          // 다이얼로그의 기본 스타일 설정
          padding: '20px',
          borderRadius: '10px',
          // 기타 스타일 설정...
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          // 다이얼로그 타이틀 스타일 설정
          fontSize: '1.2rem',
          fontWeight: 'bold',
          // 기타 스타일 설정...
        },
      },
    },
}});

export default theme;

export const menuItemStyle = {
  '&:hover': {
    backgroundColor: 'black', // 마우스 오버 시 배경색 변경
    color: 'white', // 마우스 오버 시 글자 색상 변경
  },
};

export const StyledLink = styled(RouterLink)({
  fontSize: '0.9rem',
  color: 'black',
  margin: '5px',
  textDecoration: 'none',
  '&:hover': {
    color: 'grey',
    textDecoration: 'none',
  },
});