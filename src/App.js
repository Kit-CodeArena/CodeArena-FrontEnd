/*eslint-disable*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './SignUpComponents/SignInPage';
import SignUpPage from './SignUpComponents/SignUpPage';
import HomePage from './MainComponents/HomePage';
import ProblemsPage from './ProblemComponents/ProSolutionPage';
import ProblemDetail from './ProblemComponents/ProDetailPage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // theme.js에서 정의한 테마를 임포트

// 다른 페이지 컴포넌트들을 import...

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:problemId" element={<ProblemDetail />} />
        <Route path="/" element={<HomePage />} />
        {/* 다른 라우트들... */}
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;