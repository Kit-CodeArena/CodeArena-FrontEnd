import React, { useState, useEffect }  from 'react';
import { IconButton, Grid, useMediaQuery, Container, Paper, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import '../App.css';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams } from 'react-router-dom';

export default function UpdateBoardPage() {
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const postId = useParams().postId; // URL에서 postId 추출
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

    useEffect(() => {
        const fetchPostData = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/posts/${postId}`, {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const postData = await response.json();
            setTitle(postData.title);
            setContent(postData.content);
            setCategory(postData.tags ? postData.tags[0] : ''); // 첫 번째 태그를 카테고리로 설정
            // images 상태도 여기에서 세팅해야 합니다 (이미지 데이터 구조에 따라 달라질 수 있음)
          } catch (error) {
            console.error('Fetch error:', error);
            // 에러 처리 로직
          }
        };
    
        fetchPostData();
      }, [postId]);

    const handleSubmit = async () => {
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
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
          // Content-Type을 설정하지 않아야 브라우저가 경계를 올바르게 설정할 수 있습니다.
        });
    
        if (response.ok) {
          console.log("게시물이 성공적으로 수정되었습니다.");
          navigate('/board');
        } else {
          console.log("게시물 수정 중 오류 발생");
        }
      } catch (error) {
        console.error("네트워크 오류:", error);
      }
    };

    return (
      <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minheight: '75vh', padding: '10px' }}>
        <Paper style={{ padding: '20px' }}>
        <Typography gutterBottom align="left" variant="h6">글 수정</Typography>
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
        <MenuItem value="자유">자유</MenuItem>
        <MenuItem value="질문">질문</MenuItem>
        <MenuItem value="오타/오역">오타/오역</MenuItem>
        <MenuItem value="홍보">홍보</MenuItem>
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
          게시물 수정
        </Button>
      </Paper>
    </Container>
  );
}