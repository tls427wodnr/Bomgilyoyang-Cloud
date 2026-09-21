import { useState } from 'react';

import {
    getAllChatRooms,
    readMessages
} from '../../services/chat/chatService.js';

export const useAdminChatRooms = (handleAdminAuthError) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);

    /**
     * 관리자 채팅방 목록 조회
     */
    const loadChatRooms = async () => {
        try {
            const response = await getAllChatRooms();

            setChatRooms(response.data);

        } catch (error) {
            console.error('채팅방 목록 조회 실패:', error);

            if (handleAdminAuthError(error)) {
                return;
            }

            alert('채팅방 목록을 불러오지 못했습니다.');
        }
    };

    /**
     * 채팅방 팝업 열기
     */
    const openChatRoom = async (room) => {
        setSelectedRoom(room);
        setChatOpen(true);

        try {
            await readMessages(room.roomId);

            setChatRooms((prevRooms) =>
                prevRooms.map((item) =>
                    item.roomId === room.roomId
                        ? { ...item, unread: false }
                        : item
                )
            );

        } catch (error) {
            console.error('채팅 읽음 처리 실패:', error);
        }
    };

    /**
     * 채팅방 팝업 닫기
     */
    const closeChatRoom = () => {
        setSelectedRoom(null);
        setChatOpen(false);
    };

    return {
        chatRooms,
        selectedRoom,
        chatOpen,
        loadChatRooms,
        openChatRoom,
        closeChatRoom,
    };
};