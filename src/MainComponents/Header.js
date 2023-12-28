import React, { useState } from 'react';
import { Toolbar, Button, Typography, IconButton, Collapse, Box, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = (
    <Box sx={{ display: 'flex', flexGrow: 0}}>
      <MenuItem onClick={() => navigate('/competition')}>대회</MenuItem>
      <MenuItem onClick={() => navigate('/leaderboard')}>리더보드</MenuItem>
      <MenuItem onClick={() => navigate('/problems')}>문제</MenuItem>
      <MenuItem onClick={() => navigate('/board')}>게시판</MenuItem>
      <MenuItem onClick={() => navigate('/qa')}>Q&A</MenuItem>
      <MenuItem onClick={() => navigate('/mypage')}>마이페이지</MenuItem>
    </Box>
  );

  const newmenuItems = (
    <Box sx={{ p:5, flexGrow: 1, background: "black", color: "white"}}>
      <MenuItem onClick={() => navigate('/competition')}>대회</MenuItem>
      <MenuItem onClick={() => navigate('/leaderboard')}>리더보드</MenuItem>
      <MenuItem onClick={() => navigate('/problems')}>문제</MenuItem>
      <MenuItem onClick={() => navigate('/board')}>게시판</MenuItem>
      <MenuItem onClick={() => navigate('/qa')}>Q&A</MenuItem>
      <MenuItem onClick={() => navigate('/mypage')}>마이페이지</MenuItem>
    </Box>
  );

  return (
    <React.Fragment>
      <Toolbar sx={{ height: "100px", borderBottom: 1, borderColor: 'divider'}}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="left"
          noWrap
          sx={{ flex: 1 }}
        >
         <img 
            src="1234.png" // 이미지의 URL을 여기에 삽입하세요.
            alt="Logo" 
            style={{ height: '35px' }} // 이미지 크기 조절
          />
        </Typography>
        {isLargeScreen ? menuItems : (
          <IconButton color="inherit" onClick={handleMenuToggle}>
            <MenuIcon />
          </IconButton>
        )}
        <Button variant="none" size="small" onClick={handleLoginClick}
          sx={{ 
            fontSize: '0.75rem', // 폰트 크기 조절
            padding: '5px 10px', // 내부 패딩 조절
            minHeight: '30px', // 최소 높이 설정
            minWidth: '80px'  // 최소 너비 설정
          }}>
          로그인
        </Button>
        <Button variant="none" size="small" onClick={handleSignUpClick}
          sx={{ 
            fontSize: '0.75rem', // 폰트 크기 조절
            padding: '5px 5px', // 내부 패딩 조절
            minHeight: '30px', // 최소 높이 설정
            minWidth: '80px'  // 최소 너비 설정
          }}>
          회원가입
        </Button>
      </Toolbar>
      {!isLargeScreen && (
        <Collapse in={menuOpen}>
          {newmenuItems}
        </Collapse>
      )}
    </React.Fragment>
  );
}

export default Header;
