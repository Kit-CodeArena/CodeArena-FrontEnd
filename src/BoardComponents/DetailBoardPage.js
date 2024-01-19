import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, useMediaQuery, Button , IconButton, Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../MainComponents/Header';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const [error, setError] = useState(''); // 오류 메시지 상태
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [comment, setComment] = useState(''); // 댓글 입력 상태
  const userNickname = localStorage.getItem('nickname');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const handleDeleteClick = (commentId) => {
    setDeletingCommentId(commentId);
    setDeleteDialogOpen(true);
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
    let interval = seconds / 31536000; // 연 단위
  
    if (interval > 1) {
      return Math.floor(interval) + "년 전";
    }
    interval = seconds / 2592000; // 월 단위
    if (interval > 1) {
      return Math.floor(interval) + "달 전";
    }
    interval = seconds / 86400; // 일 단위
    if (interval > 1) {
      return Math.floor(interval) + "일 전";
    }
    interval = seconds / 3600; // 시간 단위
    if (interval > 1) {
      return Math.floor(interval) + "시간 전";
    }
    interval = seconds / 60; // 분 단위
    if (interval > 1) {
      return Math.floor(interval) + "분 전";
    }
    return Math.floor(seconds) + "초 전";
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to toggle like status');
      }
  
      const updatedPost = await response.json();
      setPost(updatedPost);
      setLiked(updatedPost.likedByCurrentUser);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

// 댓글 삭제 핸들러
const handleDeleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    // 댓글 목록에서 삭제된 댓글을 제거
    setPost(prevPost => ({
      ...prevPost,
      comments: prevPost.comments.filter(comment => comment.id !== commentId)
    }));
    setDeleteDialogOpen(false);
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};

  useEffect(() => {
    const handlePageLeave = async () => {
      // 페이지를 떠날 때 추가적인 처리가 필요하지 않으면 이 부분은 비워둘 수 있습니다.
    };
    
    window.addEventListener('beforeunload', handlePageLeave);
    
    return () => {
      window.removeEventListener('beforeunload', handlePageLeave);
    };
  }, [postId]); // liked와 initialLikedState는 더 이상 필요하지 않으므로 제거
  
  useEffect(() => {
    const fetchPostDetail = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      const increaseViewCount = fetch(`/api/posts/${postId}/view`, {
        method: 'POST',
        headers: headers
      });
  
      const getPostDetail = fetch(`/api/posts/${postId}`, {
        method: 'GET',
        headers: headers
      });
  
      try {
        setIsLoading(true); // 로딩 시작
  
        // 병렬 요청 실행
        const [viewResponse, postResponse] = await Promise.all([increaseViewCount, getPostDetail]);
  
        // 조회수 증가 요청 오류 처리
        if (!viewResponse.ok) {
          const errorResponse = await viewResponse.json();
          setError(errorResponse.message); // 오류 메시지 설정
        }
  
        // 게시물 정보 요청 오류 처리
        if (!postResponse.ok) {
          const errorResponse = await postResponse.json();
          setError(errorResponse.message); // 오류 메시지 설정
        }
  
        const postData = await postResponse.json();
        setPost(postData);
        setLiked(postData.likedByCurrentUser); // 좋아요 상태를 업데이트
        setError(''); // 오류 메시지 초기화
      } catch (error) {
        setError(error); // 오류 메시지 초기화
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };
  
    fetchPostDetail();
  }, [postId, navigate]);

  if (isLoading) {
    return (
      <>
        <div className="loading-bar"></div> {/* 로딩 바 추가 */}
      </>
    );
  }

  if (error) {
    return (
      <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%', minHeight: '75vh', padding: '10px' }}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h6" color="black">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!post) {
    return <div>Loading...</div>; // 데이터 로딩 중 표시
  }

  const submitEdit = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: editingContent
      });
  
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
  
      const updatedComment = await response.json();
      // 댓글 목록에서 수정된 댓글을 업데이트합니다.
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.map(c =>
          c.id === commentId ? updatedComment : c
        ),
      }));
  
      setEditingCommentId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      // 빈 댓글을 방지
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: postId,
          content: comment
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
  
const newComment = await response.json();
    setPost(prevPost => {
      // prevPost.comments가 배열이 아니라면 빈 배열로 초기화
      const updatedComments = Array.isArray(prevPost.comments) ? prevPost.comments : [];
      return {
        ...prevPost,
        comments: [...updatedComments, newComment] // 댓글 목록에 새 댓글 추가
      };
    });
    setComment(''); // 입력 필드 초기화
  } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <>
        <Container component="main" style={{ maxWidth: isLargeScreen ? 1100 : '100%' , minHeight: '75vh', padding: '10px' }}>
        <Paper>
        <Typography 
      variant="h5" 
      component="h1" 
      gutterBottom align="left"
      onClick={() => navigate(`/board/${postId}`)}
      style={{ cursor: 'pointer', fontWeight: 200, paddingLeft: '20px', paddingTop: '10px'}}
    >
      {post.title}
    </Typography>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography style={{ paddingLeft: '20px', color: '#219afc', fontSize: '14px' }}>
      {post.authorNickname}
    </Typography>
    <Typography style={{ margin: '0 10px', fontSize: '14px' }}>
      |
    </Typography>
    <Typography style={{ color: 'gray', fontSize: '14px' }}>
      {timeSince(post.createdAt)}
    </Typography>
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography 
      variant="h6" 
      component="h2" 
      style={{ fontWeight: 200, fontSize: '13px', marginRight: '20px', color: 'gray'}}
    >
      조회수  {post.views}
    </Typography>
    <Typography 
      variant="h6" 
      component="h2" 
      style={{ fontWeight: 200, fontSize: '13px', marginRight: '20px', color: 'gray' }}
    >
      좋아요 {post.likes}
    </Typography>
  </div>
</div>

  </Paper>
  <Paper style={{ marginTop: '15px' }}>
  <div style={{ 
    border: '2px solid #e0e0e0', // 테두리
    padding: '15px', // 내부 패딩
    paddingBottom: '10px'
  }}>
    <Typography 
      variant="h6" 
      component="h2" 
      gutterBottom align="left"
      style={{ 
        fontWeight: 200 , fontSize: '15px' 
      }}
    >
      {post.content}
    </Typography>
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
    <IconButton 
      onClick={handleLikeClick}
      gutterBottom align="left"
      style={{ color: 'black', alignItems: 'center', width: '20px', height: '30px' }}
    >
      {liked ? <FavoriteIcon  fontSize="small"  /> : <FavoriteBorderIcon  fontSize="small" />}
    </IconButton>
    </div>
    </div>
        </Paper>
        {post && post.comments && post.comments.map((comment) => (
        <Paper key={comment.id} style={{ marginTop: '15px'}}>
          <div style={{ 
              border: '2px solid #e0e0e0', // 테두리
              padding: '3px', // 내부 패딩
              paddingBottom: '3px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography style={{ paddingLeft: '10px', fontSize: '14px', color: '#219afc' }}>
            {comment.authorNickname} 
          </Typography>
          <Typography style={{ paddingLeft: '10px', fontSize: '14px' }}>
            {timeSince(comment.createdAt)} 
          </Typography>
          </div>
          <Divider sx={{ border: '1px solid #e0e0e0' }} />
            {editingCommentId == comment.id ? (
              // 댓글 수정 모드
              <div>
                <TextField
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{
                    '& .MuiInputBase-input': { // 이 클래스는 TextField의 입력 부분을 지칭합니다.
                      fontSize: '14px', // 원하는 폰트 크기로 조정하세요. 예: '1rem', '16px' 등
                    }
                  }}
                />
                <Button onClick={() => submitEdit(comment.id)}>저장</Button>
                <Button onClick={() => setEditingCommentId(null)}>취소</Button>
              </div>
            ) : (
              // 일반 댓글 표시
              <div>
              <Typography gutterBottom align="left" style={{ paddingTop: '10px', paddingLeft: '10px', color: 'gray', fontSize: '14px' }}>
                {comment.content}
              </Typography>
          {comment.authorNickname == userNickname && (
      <div>
        <Button onClick={() => handleEditComment(comment.id, comment.content)}>수정</Button>
        <Button onClick={() => handleDeleteClick(comment.id)}>삭제</Button>
      </div>
    )}
    </div>)}
          </div>
        </Paper>
      ))}
      <Paper style={{ marginTop: '15px', padding: '15px' }}>
  <TextField
    fullWidth
    variant="outlined"
    placeholder="댓글을 입력하세요"
    value={comment}
    onChange={handleCommentChange}
    style={{ marginBottom: '10px' }}
  />
  <Button
    variant="contained"
    color="primary"
    onClick={handleCommentSubmit}
  >
    댓글 작성
  </Button>
</Paper>
      </Container>
      <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{"댓글을 삭제하시겠습니까?"}</DialogTitle>
  <DialogActions>
    <Button onClick={() => handleDeleteComment(deletingCommentId)}>삭제</Button>
    <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
  </DialogActions>
</Dialog>
    </>
  );
}
