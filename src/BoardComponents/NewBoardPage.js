import React, { useState, useEffect }  from 'react';
import { useMediaQuery, Container, Paper, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function NewBoardPage() {
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async () => {
    // 여기에 게시물 생성 로직을 구현하세요.
    // 예: 서버에 POST 요청 보내기
    console.log({ title, content, category, image });
    // 게시판 목록 페이지로 이동
    navigate('/board');
  };

    return (
      <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minheight: '75vh', padding: '10px' }}>
        <Paper style={{ padding: '20px' }}>
        <Typography variant="h6">새 게시물 생성</Typography>
        <TextField
          fullWidth
          label="제목"
          margin="normal"
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          fullWidth
          label="내용"
          margin="normal"
          multiline
          rows={4}
          value={content}
          onChange={handleContentChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">카테고리</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="카테고리"
            onChange={handleCategoryChange}
          >
            <MenuItem value="category1">카테고리1</MenuItem>
            <MenuItem value="category2">카테고리2</MenuItem>
            {/* 추가 카테고리... */}
          </Select>
        </FormControl>
        <Box margin="normal">
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span">
              이미지 업로드
            </Button>
          </label>
          {image && <Typography>{image.name}</Typography>}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: '10px' }}
        >
          게시물 생성
        </Button>
      </Paper>
    </Container>
  );
}