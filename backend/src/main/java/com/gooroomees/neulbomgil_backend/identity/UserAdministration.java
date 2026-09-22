package com.gooroomees.neulbomgil_backend.identity;

import java.util.List;

public interface UserAdministration {

    List<UserSummary> findRegularUsers();

    List<UserSummary> findRemovedUsers();

    void toggleStatus(Long userId);
}
