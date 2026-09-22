package com.gooroomees.neulbomgil_backend.identity;

import java.util.Optional;

public interface UserDirectory {

    Optional<UserSummary> findById(Long userId);

    Optional<UserSummary> findByEmail(String email);
}
