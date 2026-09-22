package com.gooroomees.neulbomgil_backend.administration.internal.dto;

public record AdminUserResponseDto(
        Long userId,
        String name,
        String email,
        Long boardCount,
        Long replyCount,
        String status,
        String createdAt
) {
}
