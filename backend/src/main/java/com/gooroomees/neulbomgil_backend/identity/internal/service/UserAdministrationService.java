package com.gooroomees.neulbomgil_backend.identity.internal.service;

import com.gooroomees.neulbomgil_backend.identity.internal.entity.Role;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Status;
import com.gooroomees.neulbomgil_backend.identity.UserAdministration;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.UserSummary;
import com.gooroomees.neulbomgil_backend.identity.internal.mapper.UserAuthMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class UserAdministrationService implements UserAdministration {

    private final UserAuthMapper userAuthMapper;

    @Override
    public List<UserSummary> findRegularUsers() {
        return userAuthMapper.findByRole(Role.USER).stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    public List<UserSummary> findRemovedUsers() {
        return userAuthMapper.findByStatus(Status.REMOVED).stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    @Transactional
    public void toggleStatus(Long userId) {
        UserAuth user = userAuthMapper.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다."));

        Status nextStatus = user.getStatus() == Status.ACTIVE
                ? Status.REMOVED
                : Status.ACTIVE;

        user.changeStatus(nextStatus);
        if (userAuthMapper.updateStatus(user) != 1) {
            throw new IllegalStateException("사용자 상태 변경에 실패했습니다.");
        }
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
