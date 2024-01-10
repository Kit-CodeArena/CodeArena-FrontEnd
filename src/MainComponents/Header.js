import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogActions, Divider, Toolbar, Button, Typography, IconButton, Collapse, Box, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1100px)');

  const subMenus = {
    competition: ["대회 일정", "참가 방법", "결과 발표"],
    board: ["공지사항", "업데이트 사항","오류 사항"],
    // 다른 메뉴 항목에 대한 서브 메뉴 데이터 추가...
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleImageClick = () => {
    navigate('/');
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

  const handleLoginAlertOpen = () => {
    setLoginAlertOpen(true);
  };

  // 로그인 필요 알림 Dialog 닫기
  const handleLoginAlertClose = () => {
    setLoginAlertOpen(false);
    navigate('/signin');
  };

  const handleMenuItemClick = (path) => {
    if (!isLoggedIn) {
      handleLoginAlertOpen();
    } else {
      navigate(path);
    }
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
          <MenuItem onClick={() => handleMenuItemClick(`/${menu}/${item}`)}>{item}</MenuItem>
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
      <MenuItem onClick={() => handleMenuItemClick('/leaderboard')}
              sx={{
                '&:hover': {
                  backgroundColor: 'black', // 마우스 오버 시 배경색 변경
                  color: 'white', // 마우스 오버 시 글자 색상 변경
                },
              }}>
        리더보드
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/problems')}
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
      <MenuItem onClick={() => handleMenuItemClick('/qa')}
              sx={{
                '&:hover': {
                  backgroundColor: 'black', // 마우스 오버 시 배경색 변경
                  color: 'white', // 마우스 오버 시 글자 색상 변경
                },
              }}>
        Q&A
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/mypage')}
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
      <MenuItem onClick={() => handleMenuItemClick('/competition')}>대회</MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/leaderboard')}>리더보드</MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/problems')}>문제</MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/board')}>게시판</MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/qa')}>Q&A</MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/mypage')}>마이페이지</MenuItem>
    </Box>
  );


  const authButtons = isLoggedIn ? (
    <Button variant="none" size="small" onClick={handleLogoutClick}
    sx={{ 
      fontSize: '0.75rem',
      padding: '5px 10px',
      minHeight: '30px',
      minWidth: '80px',
      bottom: "35%"
    }}>
      로그아웃
    </Button>
  ) : (
    <>
      <Button variant="none" size="small" onClick={handleLoginClick}
      sx={{ 
        fontSize: '0.75rem',
        padding: '5px 10px',
        minHeight: '30px',
        minWidth: '80px',
        bottom: "35%"
      }}>
        로그인
      </Button>
      <Button variant="none" size="small" onClick={handleSignUpClick}
      sx={{ 
        fontSize: '0.75rem',
        padding: '5px 10px',
        minHeight: '30px',
        minWidth: '80px',
        bottom: "35%"
      }}>
        회원가입
      </Button>
    </>
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
            src="/1234.png" // 이미지의 URL을 여기에 삽입하세요.
            alt="Logo" 
            style={{ height: '50px', cursor: 'pointer' }} // 이미지 크기 조절
            onClick={handleImageClick} // 이미지 클릭 시 이벤트 핸들러 추가
          />
        </Typography>
        {isLargeScreen && menuItems}
          {!isLargeScreen && (
            <IconButton color="inherit" onClick={() => setMenuOpen(!menuOpen)}>
              <MenuIcon />
            </IconButton>
          )}
        {authButtons}
      </Toolbar>
      </Box>
      <Divider />
      <Box mt={2}></Box>
      {!isLargeScreen && (
        <Collapse in={menuOpen}>
          {newmenuItems}
        </Collapse>
      )}
      {openSubMenu && renderSubMenu(openSubMenu)}
      <Dialog
      open={loginAlertOpen}
      onClose={handleLoginAlertClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        {"로그인이 필요한 서비스입니다."}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleLoginAlertClose} color="primary">
          로그인 하기
        </Button>
      </DialogActions>
    </Dialog>
    </React.Fragment>
  );
}

export default Header;