package com.gooroomees.neulbomgil_backend.identity.internal.service;

import com.gooroomees.neulbomgil_backend.identity.internal.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.UserAuthRepository;
import com.gooroomees.neulbomgil_backend.identity.UserDirectory;
import com.gooroomees.neulbomgil_backend.identity.UserSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class UserDirectoryService implements UserDirectory {

    private final UserAuthRepository userAuthRepository;

    @Override
    public Optional<UserSummary> findById(Long userId) {
        return userAuthRepository.findById(userId)
                .map(this::toSummary);
    }

    @Override
    public Optional<UserSummary> findByEmail(String email) {
        return userAuthRepository.findByEmail(email)
                .map(this::toSummary);
    }

    private UserSummary toSummary(UserAuth user) {
        return new UserSummary(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name(),
                user.getCreatedAt()
        );
    }
}
