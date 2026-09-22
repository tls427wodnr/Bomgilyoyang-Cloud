package com.gooroomees.neulbomgil_backend.identity;

import java.time.LocalDateTime;

public record UserSummary(
        Long userId,
        String name,
        String email,
        String role,
        String status,
        LocalDateTime createdAt
) {
}
