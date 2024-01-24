import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Paper, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import '../App.css';

export default function RoomDetailPage() {
    const { roomId } = useParams(); // URL로부터 roomId 추출
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userNickname = localStorage.getItem('nickname'); // 현재 사용자의 닉네임
    const [isUserInRoom, setIsUserInRoom] = useState(false); // 사용자가 참가자 목록에 있는지 여부
    const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
    const [proposalContent, setProposalContent] = useState('');
    const [leaderId, setLeaderId] = useState(null); // 리더의 ID를 저장할 상태
    const [submissionError, setSubmissionError] = useState('');

    const openProposalDialog = () => {
        setProposalDialogOpen(true);
    };

    // 신청서 작성 대화상자 닫기
    const closeProposalDialog = () => {
        setProposalDialogOpen(false);
        setProposalContent(''); // 신청 내용 초기화
        setSubmissionError(''); // 에러 메시지 초기화
    };
    const submitProposal = async () => {
        
        if (!leaderId) {
            console.error('Leader ID is not available.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/test/room/${roomId}/proposals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    leaderId: leaderId,
                    content: proposalContent
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || "정의되지 않은 오류가 발생했습니다.";
                setSubmissionError(errorMessage); // 오류 메시지 상태 업데이트
                return; // 함수 종료
            }

            // 신청서 제출 후 처리
            closeProposalDialog();
            // 추가적인 처리 (예: 메시지 표시, 페이지 새로고침 등)

        } catch (error) {
            console.error('Error submitting proposal:', error);
        }
    };

    const handleJoinRoom = () => {
        navigate(`/chat/${roomId}`);
    };

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/test/room/${roomId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setRoomDetails(data);
                const isUserPresent = data.users.some(user => user.nickname === userNickname);
                setIsUserInRoom(isUserPresent);
                const leader = data.users.find(user => user.chatRoomUserRole === "LEADER");
                if (leader) {
                    setLeaderId(leader.userId);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoomDetails();
    }, [roomId, userNickname]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container component="main" maxWidth="md">
            {isLoading && <div className="loading-bar"></div>}
            <Paper style={{ padding: '20px' }}>
                {roomDetails && (
                    <>
                        <Typography variant="h5" component="h1">
                            {roomDetails.name}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            최대 참가자 수: {roomDetails.maxUserNum}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            현재 참가자 수: {roomDetails.curUserNum}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            상태: {roomDetails.status}
                        </Typography>
                        <List>
                            {roomDetails.users.map(user => (
                                <ListItem key={user.id}>
                                    <ListItemText
                                        primary={user.nickname}
                                        secondary={user.chatRoomUserRole}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
{!isLoading && (
    isUserInRoom ? (
        <Button variant="contained" color="primary" onClick={handleJoinRoom}>
            채팅방 들어가기
        </Button>
    ) : (
        <Button variant="contained" color="secondary" onClick={openProposalDialog}>
            신청서 작성하기
        </Button>
    )
)}
            </Paper>
            <Dialog open={proposalDialogOpen} onClose={closeProposalDialog}>
    <DialogTitle>{roomDetails ? roomDetails.name : "Loading..."}</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="신청 내용"
            type="text"
            fullWidth
            value={proposalContent}
            onChange={(e) => setProposalContent(e.target.value)}
        />
        {submissionError && (
            <Typography color="error" style={{ marginTop: '10px' }}>
                {submissionError}
            </Typography>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={submitProposal} color="primary">
            참가 신청
        </Button>
        <Button onClick={closeProposalDialog} color="primary">
            취소
        </Button>
    </DialogActions>
</Dialog>
        </Container>
    );
}
