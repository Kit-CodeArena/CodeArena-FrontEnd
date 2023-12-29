import React, { useState } from 'react';
import { Divider, Toolbar, Button, Typography, IconButton, Collapse, Box, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1100px)');

  const subMenus = {
    competition: ["대회 일정", "참가 방법", "결과 발표"],
    board: ["공지사항", "업데이트 사항","오류 사항"],
    // 다른 메뉴 항목에 대한 서브 메뉴 데이터 추가...
  };

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMouseEnter = (menu) => {
    setOpenSubMenu(menu);
  };

  const handleMouseLeave = () => {
    setOpenSubMenu(null);
  };

  const renderSubMenu = (menu) => {
    return (
      <Box
      sx={{
        p: 3,
        background: 'white',
        color: 'black',
        animation: 'fade-in 0.5s',
        '@keyframes fade-in': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        },
      }}
      onMouseEnter={() => handleMouseEnter(menu)} // 서브 메뉴에 마우스가 올라갔을 때
      onMouseLeave={handleMouseLeave} // 서브 메뉴에서 마우스가 벗어났을 때
    >
      {subMenus[menu].map((item, index, array) => (
        <React.Fragment key={index}>
          <MenuItem onClick={() => navigate(`/${menu}/${item}`)}>{item}</MenuItem>
          {index < array.length - 1 && <Divider />} {/* 마지막 항목을 제외하고 Divider 추가 */}
        </React.Fragment>
      ))}
    </Box>
  );
};

  const menuItems = (
    <Box sx={{ display: 'flex',
    flexGrow: 1, 
    position: 'absolute', 
    bottom: "-1px", 
    left: "30%",
    width: '100%' }}>
      <MenuItem 
        onMouseEnter={() => handleMouseEnter('competition')}
        onMouseLeave={handleMouseLeave}
        sx={{
          '&:hover': {
            backgroundColor: 'black', // 마우스 오버 시 배경색 변경
            color: 'white', // 마우스 오버 시 글자 색상 변경
          },
        }}
      >
        대회
      </MenuItem>
      <MenuItem onClick={() => navigate('/leaderboard')}
              sx={{
                '&:hover': {
                  backgroundColor: 'black', // 마우스 오버 시 배경색 변경
                  color: 'white', // 마우스 오버 시 글자 색상 변경
                },
              }}>
        리더보드
      </MenuItem>
      <MenuItem onClick={() => navigate('/problems')}
              sx={{
                '&:hover': {
                  backgroundColor: 'black', // 마우스 오버 시 배경색 변경
                  color: 'white', // 마우스 오버 시 글자 색상 변경
                },
              }}>
        문제
      </MenuItem>
      <MenuItem 
        onMouseEnter={() => handleMouseEnter('board')}
        onMouseLeave={handleMouseLeave}
        sx={{
          '&:hover': {
            backgroundColor: 'black', // 마우스 오버 시 배경색 변경
            color: 'white', // 마우스 오버 시 글자 색상 변경
          },
        }}
      >
        게시판
      </MenuItem>
      <MenuItem onClick={() => navigate('/qa')}
              sx={{
                '&:hover': {
                  backgroundColor: 'black', // 마우스 오버 시 배경색 변경
                  color: 'white', // 마우스 오버 시 글자 색상 변경
                },
              }}>
        Q&A
      </MenuItem>
      <MenuItem onClick={() => navigate('/mypage')}
              sx={{
                '&:hover': {
                  backgroundColor: 'black', // 마우스 오버 시 배경색 변경
                  color: 'white', // 마우스 오버 시 글자 색상 변경
                },
              }}>
        마이페이지
      </MenuItem>
    </Box>
  );

  const newmenuItems = (
    <Box sx={{ p:5, flexGrow: 1, background: "white", color: "black"}}>
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
       <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Toolbar sx={{ 
        height: "80px",
        width: '100%', 
        maxWidth: isLargeScreen ? 1100 : '100%',}}>
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
            style={{ height: '50px' }} // 이미지 크기 조절
          />
        </Typography>
        {isLargeScreen && menuItems}
          {!isLargeScreen && (
            <IconButton color="inherit" onClick={() => setMenuOpen(!menuOpen)}>
              <MenuIcon />
            </IconButton>
          )}
        <Button variant="none" size="small" onClick={handleLoginClick}
          sx={{ 
            fontSize: '0.75rem', // 폰트 크기 조절
            padding: '5px 10px', // 내부 패딩 조절
            minHeight: '30px', // 최소 높이 설정
            minWidth: '80px',  // 최소 너비 설정
            bottom : "35%"
          }}>
          로그인
        </Button>
        <Button variant="none" size="small" onClick={handleSignUpClick}
          sx={{ 
            fontSize: '0.75rem', // 폰트 크기 조절
            padding: '5px 5px', // 내부 패딩 조절
            minHeight: '30px', // 최소 높이 설정
            minWidth: '80px',  // 최소 너비 설정
            bottom : "35%"
          }}>
          회원가입
        </Button>
      </Toolbar>
      </Box>
      <Divider />
      {!isLargeScreen && (
        <Collapse in={menuOpen}>
          {newmenuItems}
        </Collapse>
      )}
      {openSubMenu && renderSubMenu(openSubMenu)}
    </React.Fragment>
  );
}

export default Header;