import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, List, ListItem, Typography } from '@mui/material';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export default function ChatRoom() {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClient = useRef(null);
    const userNickname = localStorage.getItem('nickname'); // 사용자 닉네임 예시
    const token = localStorage.getItem('token'); // 사용자 토큰 예시

    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/ws/chat`);
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({ 'Authorization': `Bearer ${token}` }, () => {
            stompClient.current.subscribe(`/topic/public/${roomId}`, (data) => {
                const newMsg = JSON.parse(data.body);
                setMessages(messages => [...messages, newMsg]);
            });
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [roomId, token]);

    const sendMessage = () => {
        if (newMessage && stompClient.current) {
            const chatMessage = {
                roomId,
                type: 'CHAT',
                content: newMessage,
                sender: userNickname
            };

            stompClient.current.send(`/app/chat.sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
            setNewMessage('');
        }
    };

    return (
        <Container maxWidth="md">
            <List>
                {messages.map((message, index) => (
                    <ListItem key={index}>
                        <Typography color="textPrimary">
                            {message.sender}: {message.content}
                        </Typography>
                    </ListItem>
                ))}
            </List>
            <TextField
                label="Message"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
        </Container>
    );
}