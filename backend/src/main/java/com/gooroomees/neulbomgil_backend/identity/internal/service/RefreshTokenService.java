package com.gooroomees.neulbomgil_backend.identity.internal.service;

import com.gooroomees.neulbomgil_backend.identity.internal.entity.RefreshToken;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken findByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Refresh 토큰입니다."));
    }
}
