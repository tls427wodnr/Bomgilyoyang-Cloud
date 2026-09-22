package com.gooroomees.neulbomgil_backend.identity.internal.service;

import com.gooroomees.neulbomgil_backend.identity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.UserAuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserAuthService {
    private final UserAuthRepository userAuthRepository;

    public UserAuth findById(Long userId) {
        return userAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }
}
