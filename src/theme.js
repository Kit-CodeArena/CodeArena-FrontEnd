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
  }
});

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