import React, { useState } from 'react';

export default function CreateCompetitionRoom() {
  const [roomName, setRoomName] = useState('');
  const [maxUserNum, setMaxUserNum] = useState(10);
  const [tag, setTag] = useState('COMPETITION');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: roomName,
          maxUserNum: maxUserNum,
          tag: tag
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '정의되지 않은 오류');
        return;
      }

      const data = await response.json();
      // 여기에서 data를 사용하여 UI 업데이트

    } catch (error) {
      setError('네트워크 오류');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="채팅방 이름"
      />
      <input
        type="number"
        value={maxUserNum}
        onChange={(e) => setMaxUserNum(e.target.value)}
        placeholder="최대 사용자 수"
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="COMPETITION">COMPETITION</option>
        <option value="COMMON">COMMON</option>
      </select>
      <button onClick={handleSubmit}>생성하기</button>
      {error && <p>{error}</p>}
    </div>
  );
}