package com.gooroomees.neulbomgil_backend.identity.internal.repository;

import com.gooroomees.neulbomgil_backend.identity.Role;
import com.gooroomees.neulbomgil_backend.identity.Status;
import com.gooroomees.neulbomgil_backend.identity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {
    Optional<UserAuth> findByEmail(String email);

    boolean existsByEmail(String email);


    List<UserAuth> findByStatus(Status status);

    List<UserAuth> findByRole(Role role);
}
