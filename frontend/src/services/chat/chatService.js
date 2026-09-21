import api from '../../api/axios.js';

const CHAT_API = '/api/chatrooms';

/**
 * 채팅방 시작
 * - 사용자 채팅방을 생성하거나 기존 채팅방 반환
 */
export const startChatRoom = () => {
    return api.post(`${CHAT_API}/start`);
};

/**
 * 채팅 메시지 목록 조회
 * @param {number} roomId
 */
export const getMessagesByRoomId = (roomId) => {
    return api.get(`${CHAT_API}/${roomId}/message`);
};

/**
 * 관리자 전체 채팅방 목록 조회
 */
export const getAllChatRooms = () => {
    return api.get(`${CHAT_API}/admin`);
};

/**
 * 채팅 읽음 처리
 * @param {number} roomId
 */
export const readMessages = (roomId) => {
    return api.put(`${CHAT_API}/${roomId}/read`);
};

/**
 * 읽지 않은 채팅 여부 확인
 */
export const hasUnreadChats = () => {
    return api.get(`${CHAT_API}/unread`);
};