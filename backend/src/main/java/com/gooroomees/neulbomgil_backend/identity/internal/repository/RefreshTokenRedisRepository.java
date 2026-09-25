package com.gooroomees.neulbomgil_backend.identity.internal.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRedisRepository {

    private static final String KEY_PREFIX = "auth:refresh:";

    private final StringRedisTemplate redisTemplate;

    public void save(
            Long userId,
            String refreshToken,
            Duration ttl
    ) {
        redisTemplate.opsForValue().set(
                createKey(userId),
                refreshToken,
                ttl
        );
    }

    public Optional<String> findByUserId(Long userId) {
        return Optional.ofNullable(
                redisTemplate.opsForValue().get(createKey(userId))
        );
    }

    public void deleteByUserId(Long userId) {
        redisTemplate.delete(createKey(userId));
    }

    private String createKey(Long userId) {
        return KEY_PREFIX + userId;
    }
}