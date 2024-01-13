/*eslint-disable*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SignInPage from './SignUpComponents/SignInPage';
import SignUpPage from './SignUpComponents/SignUpPage';
import HomePage from './MainComponents/HomePage';
import ProblemsPage from './ProblemComponents/ProSolutionPage';
import ProblemDetail from './ProblemComponents/ProDetailPage';
import { ThemeProvider } from '@mui/material/styles';
import Header from './MainComponents/Header';
import theme from './theme'; 
import BoardPage from './BoardComponents/BoardPage';
import MyPage from './MyPageComponents/MyPage';
import Typography from '@mui/material/Typography';
import { StyledLink } from './theme';
import './App.css';
import LeaderPage from './LeaderBoardComponents/LeaderBoardPage';
import CompetitionPage from './CompetitionComponents/CompetitionPage';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <StyledLink color="inherit" href="https://github.com/Kit-CodeArena/" target="_blank">
        Our Website
      </StyledLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/signin';

  return (
    <div className={isAuthPage ? '' : 'page-content'}>
      <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/problems/:problemId" element={<ProblemDetail />} />
      <Route path="/board" element={<BoardPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/leaderboard" element={<LeaderPage />} />
      <Route path="/competition" element={<CompetitionPage />} />
      </Routes>
      <footer>
        <Copyright sx={{ mt: 10, mb: 4 }} />
   </footer>
    </div>
  );
}


function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
    <div className="App">
    <Header />
      <AppContent />
    </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;