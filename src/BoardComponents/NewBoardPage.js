import React, { useState, useEffect }  from 'react';
import { IconButton, Grid, useMediaQuery, Container, Paper, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import '../App.css';
import CancelIcon from '@mui/icons-material/Cancel';

export default function NewBoardPage() {
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);

    // 이미지 상태를 배열로 관리
    const [images, setImages] = useState([]);

    // 이미지 업로드 핸들러
    const handleImageChange = (event) => {
      setImages([...images, ...event.target.files]);
    };
  
    // 이미지 취소 핸들러
    const handleImageRemove = (index) => {
      setImages(images.filter((_, i) => i !== index));
    };

  const handleSubmit = async () => {
    // 여기에 게시물 생성 로직을 구현하세요.
    // 예: 서버에 POST 요청 보내기
    console.log({ title, content, category, images });
    // 게시판 목록 페이지로 이동
    navigate('/board');
  };

    return (
      <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minheight: '75vh', padding: '10px' }}>
        <Paper style={{ padding: '20px' }}>
        <Typography gutterBottom align="left" variant="h6">글 쓰기</Typography>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="제목"
      margin="normal"
      value={title}
      onChange={handleTitleChange}
      sx={{
        '& .MuiInputBase-input': {
          fontSize: '16px',
        }
      }}
    />
  </Grid>
  <Grid item xs={6}>
    <FormControl fullWidth margin="normal">
      <InputLabel id="category-label">카테고리</InputLabel>
      <Select
        labelId="category-label"
        value={category}
        label="카테고리"
        gutterBottom align="left"
        onChange={handleCategoryChange}
      >
        <MenuItem value="category1">자유</MenuItem>
        <MenuItem value="category2">질문</MenuItem>
        <MenuItem value="category3">오타/오역</MenuItem>
        <MenuItem value="category4">홍보</MenuItem>
        {/* 추가 카테고리... */}
      </Select>
    </FormControl>
  </Grid>
</Grid>
<TextField
    fullWidth
    label="내용"
    margin="normal"
    value={content}
    onChange={handleContentChange}
    multiline
    rows={4}
  />
<Box margin="normal" display="flex" flexDirection="column" alignItems="start">
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" sx={{ mb: 2 }}>
              이미지 업로드
            </Button>
          </label>
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box position="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <IconButton 
                    onClick={() => handleImageRemove(index)} 
                    color="error"
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          게시물 생성
        </Button>
      </Paper>
    </Container>
  );
}