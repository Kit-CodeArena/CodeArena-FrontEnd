import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogTitle, DialogActions, Divider, Toolbar, Button, Typography,
   IconButton, Collapse, Box, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const isCurrentPage = (path) => {
    return location.pathname === path;
  };

  const menuItemStyle = (path) => {
    const isActivePage = isCurrentPage(path);
    return {
      backgroundColor: isActivePage ? 'black' : 'transparent',
      color: isActivePage ? 'white' : 'inherit',
      '&:hover': {
        backgroundColor: 'black',
        color: 'white',
        // 활성화된 페이지의 MenuItem에 대한 추가적인 마우스 오버 스타일
        ...(isActivePage && {
          backgroundColor: 'black',
          color: 'white',
        }),
      },
    };
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    // 다른 상태 업데이트 및 페이지 이동 등
    setLogoutDialogOpen(false);
    setIsLoggedIn(false);
    navigate('/signin');
  };

    // 로그아웃 다이얼로그 닫기
    const handleLogoutCancel = () => {
      setLogoutDialogOpen(false);
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

  const menuItems = (
    <Box sx={{ display: 'flex',
    flexGrow: 1, 
    position: 'absolute', 
    bottom: "-1px", 
    left: "30%",
    width: '100%' }}>
      <MenuItem onClick={() => handleMenuItemClick('/competition')}
        sx={menuItemStyle('/competition')}
      >
        대회
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/leaderboard')}
        sx={menuItemStyle('/leaderboard')}>
        리더보드
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/problems')}
        sx={menuItemStyle('/problems')}>
        문제
      </MenuItem>
      <MenuItem 
        onClick={() => handleMenuItemClick('/board')}
        sx={menuItemStyle('/board')}>
        게시판
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick('/mypage')}
        sx={menuItemStyle('/mypage')}>
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
          로그인창 이동
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog
        open={logoutDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleLogoutCancel}
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"로그아웃 하시겠습니까?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            로그아웃을 하시면 다시 로그인해야 합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleLogoutConfirm}>로그아웃</Button>
          <Button onClick={handleLogoutCancel}>취소</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Header;