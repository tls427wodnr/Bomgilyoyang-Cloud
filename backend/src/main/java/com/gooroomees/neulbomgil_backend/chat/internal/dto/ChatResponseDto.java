package com.gooroomees.neulbomgil_backend.chat.internal.dto;


import java.time.LocalDateTime;

public record ChatResponseDto(
        Long chatId,
        Long roomId,
        Long senderId,
        String message,
        LocalDateTime createdAt,
        LocalDateTime readAt
) {
}
