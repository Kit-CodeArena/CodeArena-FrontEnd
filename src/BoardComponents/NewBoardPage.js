import React, { useState, useEffect }  from 'react';
import { FormHelperText, IconButton, Grid, useMediaQuery, Container, Paper, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
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
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.trim() !== '') {
      setTitleError(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.trim() !== '') {
      setContentError(false);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (e.target.value.trim() !== '') {
      setCategoryError(false);
    }
  };

    // 이미지 상태를 배열로 관리
    const [images, setImages] = useState([]);

    // 이미지 업로드 핸들러
    const handleImageChange = (event) => {
      if (event.target.files[0]) {
        setImages([event.target.files[0]]); // 새 이미지로 대체
      }
    };
  
    // 이미지 취소 핸들러
    const handleImageRemove = () => {
      setImages([]); // 이미지 배열을 비웁니다.
    };

    const handleSubmit = async () => {
          // 입력 검증
    let isValid = true;
    if (title.trim() === '') {
      setTitleError(true);
      isValid = false;
    }
    if (content.trim() === '') {
      setContentError(true);
      isValid = false;
    }
    if (category.trim() === '') {
      setCategoryError(true);
      isValid = false;
    }

    if (!isValid) {
      return; // 입력이 유효하지 않으면 제출을 중단합니다.
    }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (category) {
        formData.append('tags', category);
      }
      images.forEach((image) => {
        formData.append('image', image);
      });
    
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
          // Content-Type을 설정하지 않아야 브라우저가 경계를 올바르게 설정할 수 있습니다.
        });
    
        if (response.ok) {
          console.log("게시물이 성공적으로 생성되었습니다.");
          navigate('/board');
        } else {
          console.log("게시물 생성 중 오류 발생");
        }
      } catch (error) {
        console.error("네트워크 오류:", error);
      }
    };

    return (
      <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minheight: '75vh', padding: '10px' }}>
        <Paper style={{ padding: '20px' }}>
        <Typography gutterBottom align="left" variant="h6">글 쓰기</Typography>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
    <TextField
    error={titleError}
    helperText={titleError ? "제목을 입력해주세요." : ""}
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
    <FormControl  error={categoryError} fullWidth margin="normal">
      <InputLabel id="category-label">카테고리</InputLabel>
      <Select
        labelId="category-label"
        value={category}
        label="카테고리"
        gutterBottom align="left"
        onChange={handleCategoryChange}
      >
        <MenuItem value="자유">자유</MenuItem>
        <MenuItem value="질문">질문</MenuItem>
        <MenuItem value="오타/오역">오타/오역</MenuItem>
        <MenuItem value="홍보">홍보</MenuItem>
        {/* 추가 카테고리... */}
      </Select>
      {categoryError && <FormHelperText>카테고리를 선택해주세요.</FormHelperText>}
    </FormControl>
  </Grid>
</Grid>
<TextField
error={contentError}
helperText={contentError ? "내용을 입력해주세요." : ""}
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
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined" component="span" sx={{ mb: 2 }}>
          이미지 업로드
        </Button>
      </label>
      {images.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3}>
            <Box position="relative">
              <img
                src={URL.createObjectURL(images[0])}
                alt="Uploaded image"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <IconButton 
                    onClick={handleImageRemove} 
                    color="error"
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <CancelIcon />
                  </IconButton>
            </Box>
          </Grid>
        </Grid>
      )}
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