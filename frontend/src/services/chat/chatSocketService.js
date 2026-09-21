import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

/**
 * WebSocket 연결
 */
export const connectChatSocket = (onConnect) => {
    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws/chat`);

    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log('WebSocket 연결 완료');

        if (onConnect) {
            onConnect();
        }
    });
};

/**
 * 특정 채팅방 구독
 */
export const subscribeChatRoom = (roomId, onMessage) => {
    if (!stompClient || !stompClient.connected) {
        console.error('WebSocket이 연결되지 않았습니다.');
        return null;
    }

    return stompClient.subscribe(`/sub/chatrooms/${roomId}`, (message) => {
        const response = JSON.parse(message.body);
        onMessage(response);
    });
};

/**
 * 메시지 전송
 */
export const sendChatMessage = (roomId, userId, message) => {
    if (!stompClient || !stompClient.connected) {
        alert('채팅 서버에 아직 연결되지 않았습니다.');
        return;
    }

    stompClient.send(
        `/pub/chatrooms/${roomId}/messages`,
        { userId: userId },
        JSON.stringify({
            message: message
        })
    );
};

/**
 * WebSocket 연결 해제
 */
export const disconnectChatSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log('WebSocket 연결 종료');
        });
    }

    stompClient = null;
};