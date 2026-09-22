package com.gooroomees.neulbomgil_backend.identity;

import java.util.List;

/**
 * 관리자 기능에 제공하는 사용자 관리 API입니다.
 */
public interface UserAdministration {

    List<UserSummary> findUsersByRole(Role role);

    List<UserSummary> findUsersByStatus(Status status);

    void toggleStatus(Long userId);
}
