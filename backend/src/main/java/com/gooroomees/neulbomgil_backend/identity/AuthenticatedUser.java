package com.gooroomees.neulbomgil_backend.identity;

public record AuthenticatedUser(
        Long userId,
        String email,
        String role
) {
}
