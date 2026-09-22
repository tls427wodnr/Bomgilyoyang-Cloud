package com.gooroomees.neulbomgil_backend.chat.internal.dto;


import java.time.LocalDateTime;

public record ChatRoomResponseDto(
        Long roomId,
        Long userId,
        String name,
        String lastMessage,
        LocalDateTime lastMessageAt,
        boolean unread

) {
}
