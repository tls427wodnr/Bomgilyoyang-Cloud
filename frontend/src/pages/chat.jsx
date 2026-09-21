import { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useSearchParams } from "react-router-dom";

import {
    connectChatSocket,
    subscribeChatRoom,
    sendChatMessage,
    disconnectChatSocket
} from '../services/chat/chatSocketService.js';

import {
    getMessagesByRoomId
} from '../services/chat/chatService.js';

import { AuthContext } from '../context/auth/AuthContext.jsx';

import rumiFace from '../assets/images/characters/rumi-face.png';

import '../css/chat.css';

function Chat() {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const { user } = useContext(AuthContext);

    const userId = user?.userId;
    
    const queryPartnerName = searchParams.get("partnerName");


    const partnerName =
    user?.role === "ADMIN"
        ? queryPartnerName || "사용자"
        : "관리자";




    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const messageBoxRef = useRef(null);


    /**
     * 기존 메시지 목록 조회
     */
    const loadMessages = async () => {
        try {
            const response = await getMessagesByRoomId(roomId);
            setMessages(response.data);

        } catch (error) {
            console.error('채팅 메시지 목록 조회 실패:', error);
            alert('채팅 메시지를 불러오지 못했습니다.');
        }
    };
 /**
     * 메시지 전송
     */
    const handleSendMessage = () => {
        const message = inputMessage.trim();

        if (message === '') {
            return;
        }

        if (!userId) {
            alert('사용자 정보를 확인할 수 없습니다.');
            return;
        }

        sendChatMessage(roomId, userId, message);

        setInputMessage('');
    };

    /**
     * Enter 전송
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    /**
     * 날짜 포맷 yyyy.MM.dd
     */
    const formatDay = (dateTime) => {
        if (!dateTime) return '';

        const date = new Date(dateTime);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}.${month}.${day}`;
    };

    /**
     * 시간 포맷 오전/오후 HH:mm
     */
    const formatTime = (dateTime) => {
        if (!dateTime) return '';

        const date = new Date(dateTime);

        const period = date.getHours() < 12 ? '오전' : '오후';
        let hours = date.getHours() % 12;

        if (hours === 0) {
            hours = 12;
        }

        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${period} ${String(hours).padStart(2, '0')}:${minutes}`;
    };

    /**
     * 날짜 구분선이 필요한지 확인
     */
    const shouldShowDateDivider = (currentMessage, index) => {
        if (index === 0) {
            return true;
        }

        const previousMessage = messages[index - 1];

        return formatDay(previousMessage.createdAt) !== formatDay(currentMessage.createdAt);
    };

    /**
     * 최초 로딩 + WebSocket 연결
     */
    useEffect(() => {
    if (!userId) {
        return;
    }

    loadMessages();

    connectChatSocket(() => {
        subscribeChatRoom(roomId, (message) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                message
            ]);
        });
    });

    return () => {
        disconnectChatSocket();
    };
}, [roomId, userId]);

    /**
     * 메시지 추가될 때 스크롤 아래로 이동
     */
    useEffect(() => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <div
                id="messageBox"
                className="message-box"
                ref={messageBoxRef}
            >
                {messages.map((msg, index) => {
                    const isMyMessage = Number(msg.senderId) === Number(userId);

                    return (
                        <div key={msg.chatId || index}>
                            {shouldShowDateDivider(msg, index) && (
                                <div className="date-divider">
                                    <span>{formatDay(msg.createdAt)}</span>
                                </div>
                            )}

                            <div
                                className={
                                    isMyMessage
                                        ? 'message-wrapper my-wrapper'
                                        : 'message-wrapper other-wrapper'
                                }
                            >
                                {isMyMessage ? (
                                    <div className="message-row">
                                        <small className="message-time">
                                            {formatTime(msg.createdAt)}
                                        </small>

                                        <div className="message my-message">
                                            <div>{msg.message}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="message-row">
                                        <img
                                            src={rumiFace}
                                            alt="상대방 프로필"
                                            className="profile-image"
                                        />

                                        <div>
                                           <div className="sender-name">
    {partnerName}
</div>

                                            <div className="message other-message">
                                                <div>{msg.message}</div>
                                            </div>
                                        </div>

                                        <small className="message-time">
                                            {formatTime(msg.createdAt)}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="input-box">
                <textarea
                    value={inputMessage}
                    placeholder="메시지를 입력하세요"
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    type="button"
                    onClick={handleSendMessage}
                >
                    전송
                </button>
            </div>
        </div>
    );
}

export default Chat;