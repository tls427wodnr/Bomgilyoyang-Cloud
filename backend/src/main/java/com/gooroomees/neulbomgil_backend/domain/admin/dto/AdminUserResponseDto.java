package com.gooroomees.neulbomgil_backend.domain.admin.dto;

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
