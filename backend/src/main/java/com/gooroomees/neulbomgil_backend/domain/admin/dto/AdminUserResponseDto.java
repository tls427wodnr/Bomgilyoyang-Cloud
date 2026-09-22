package com.gooroomees.neulbomgil_backend.domain.admin.dto;

import com.gooroomees.neulbomgil_backend.identity.Status;


public record AdminUserResponseDto(
        Long userId,
        String name,
        String email,
        Long boardCount,
        Long replyCount,
        Status status,
        String createdAt
) {
}
