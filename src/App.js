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
import PostDetail from './BoardComponents/DetailBoardPage';
import NewBoardPage from './BoardComponents/NewBoardPage';
import UpdateBoardPage from './BoardComponents/UpdateBoardPage';
import CreateProblemPage from './ProblemComponents/CreateProblemPage';

function Copyright(props) {
  return (
<Typography variant="body2" color="text.secondary" align="center" {...props}>
  {'Copyright © '}
  <a
    style={{ color: 'black', textDecoration: '' }}
    href="https://mui.com/"
    target="_blank"
    rel="noopener noreferrer"
  >
    MUI.COM
  </a>
  {' '}
  {new Date().getFullYear()}
  {'.'}
  <br /> 
  {'Made by '}
  <a
    style={{ color: 'black', textDecoration: '' }}
    href="https://github.com/Kit-CodeArena/"
    target="_blank"
    rel="noopener noreferrer"
  >
     Our Website
  </a>
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
      <Route path="/board/:postId" element={<PostDetail />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/leaderboard" element={<LeaderPage />} />
      <Route path="/competition" element={<CompetitionPage />} />
      <Route path="/create-post" element={<NewBoardPage />} />
      <Route path="/update-post/:postId" element={<UpdateBoardPage />} />
      <Route path="/create-problem" element={<CreateProblemPage />} />
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