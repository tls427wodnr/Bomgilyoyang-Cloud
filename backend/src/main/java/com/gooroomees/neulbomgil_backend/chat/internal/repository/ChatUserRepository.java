package com.gooroomees.neulbomgil_backend.chat.internal.repository;

import com.gooroomees.neulbomgil_backend.identity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatUserRepository extends JpaRepository<UserAuth, Long> {
}
