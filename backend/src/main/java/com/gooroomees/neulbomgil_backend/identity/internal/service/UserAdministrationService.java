package com.gooroomees.neulbomgil_backend.identity.internal.service;

import com.gooroomees.neulbomgil_backend.identity.Role;
import com.gooroomees.neulbomgil_backend.identity.Status;
import com.gooroomees.neulbomgil_backend.identity.UserAdministration;
import com.gooroomees.neulbomgil_backend.identity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.UserSummary;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.UserAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class UserAdministrationService implements UserAdministration {

    private final UserAuthRepository userAuthRepository;

    @Override
    public List<UserSummary> findUsersByRole(Role role) {
        return userAuthRepository.findByRole(role).stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    public List<UserSummary> findUsersByStatus(Status status) {
        return userAuthRepository.findByStatus(status).stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    @Transactional
    public void toggleStatus(Long userId) {
        UserAuth user = userAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다."));

        Status nextStatus = user.getStatus() == Status.ACTIVE
                ? Status.REMOVED
                : Status.ACTIVE;

        user.changeStatus(nextStatus);
    }

    private UserSummary toSummary(UserAuth user) {
        return new UserSummary(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}
