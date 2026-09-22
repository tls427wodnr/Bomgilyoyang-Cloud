package com.gooroomees.neulbomgil_backend.identity;

import java.time.LocalDateTime;

public record UserSummary(
        Long userId,
        String name,
        String email,
        Role role,
        Status status,
        LocalDateTime createdAt
) {
}
